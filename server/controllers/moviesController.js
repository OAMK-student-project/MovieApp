import { updateFromTmdb, deleteMovie } from "../models/movieModel.js";
import { getReviewedMoviesWithStats, getTrendingWithStats } from "../services/movieService.js";
import { fetchMovieWithCredits } from "../services/tmdbService.js";

async function getMovie(req, res, next) {
    try {
        const tmdbId = Number(req.params.tmdbId);
        const data = await fetchMovieWithCredits(tmdbId);
        res.json(data);
    } catch (error) { 
        next(error); 
    }
}

async function addMovieToDb(movie_id) {
  const movie = await fetchMovieWithCredits(Number(movie_id));
  return updateFromTmdb(movie);
}

async function removeMovieFromDb(movie_id){
    return await deleteMovie(movie_id);
}

async function getAll(req, res, next) {
    try {
        const data = await getReviewedMoviesWithStats();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

async function getTrending(req, res, next) {
    try {
        const timeWindow = req.query.window === "day" ? "day" : "day";
        const page = Number(req.query.page) || 1;
        const data = await getTrendingWithStats(timeWindow, page);
        res.json(data);
    } catch (err) { 
        next(err); 
    }
}
export { getMovie, addMovieToDb, removeMovieFromDb, getAll, getTrending }