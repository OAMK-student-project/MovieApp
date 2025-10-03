import { getAllMovies, findById, updateFromTmdb, isStale } from "../models/movieModel.js";
import { getAllReviewsTmdbIds, getStatsForIds, statisticsInDatabase, myReviewInDatabase } from "../models/reviewsModel.js"
import { fetchMovieById, getTrendingMovies as tmdbTrending } from "../services/tmdbService.js";

const TTL_MS = 7 * 24 * 3600 * 1000; // 7 vrk

export async function getOrCacheMovie(tmdbId) {
    const cached = await findById(tmdbId);
    if (!cached || isStale(cached, TTL_MS)) {
        const tmdb = await fetchMovieById(tmdbId);
        const row = await updateFromTmdb(tmdb);
        return row;
    }
    return cached;
}

async function getMovieWithStats(tmdbId, userId) {
  const movie = await getOrCacheMovie(tmdbId);
  const statistics = await statisticsInDatabase(tmdbId);
  let myReview = null;
  if (userId) {
    myReview = await myReviewInDatabase(userId, tmdbId);
  }

  return {
    movie: {
      id: movie.movie_id,
      title: movie.title,
      original_title: movie.original_title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      runtime: movie.runtime,
      genres: movie.genres,
      overview: movie.overview
    },
    statistics,
    myReview
  };
}


function attachData(movies, statsMap){
  return movies.map(movie => ({
    id: movie.movie_id,
    title: movie.title,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    backdrop_path:movie.backdrop_path,
    runtime: movie.runtime,
    genres:movie.genres,
    credits: movie.credits,
    overview: movie.overview,
    avg_rating: statsMap.get(movie.movie_id)?.avg_rating ?? null,
    review_count: statsMap.get(movie.movie_id)?.review_count ?? 0
  }));
}

async function getReviewedMoviesWithStats(){
    const tmdbIds = await getAllReviewsTmdbIds();
    const movies = await getAllMovies();
    const ids = tmdbIds.map(movie => Number(movie.movie_id));

    const statsMap = await getStatsForIds(ids);
    return attachData(movies, statsMap);
}

async function getTrendingWithStats(timeWindow = "day", page = 1) {
  const tmdbList = await tmdbTrending(timeWindow, page);
  const ids = tmdbList.results.map(movie => Number(movie.id));

  const statsMap = await getStatsForIds(ids);
  const enriched = attachData(
    tmdbList.results.map(m => ({ ...m, movie_id: Number(m.id) })),
    statsMap
  );
  return {
    results: enriched,
    page: tmdbList.page,
    total_pages: tmdbList.total_pages,
    total_results: tmdbList.total_results,
  };
}


export { getMovieWithStats, getReviewedMoviesWithStats, getTrendingWithStats }