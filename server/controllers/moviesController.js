import { updateFromTmdb, deleteMovie } from "../models/movieModel.js";
import { getReviewedMoviesWithStats, getTrendingWithStats } from "../services/movieService.js";
import { fetchMovieWithCredits } from "../services/tmdbService.js";
import { ApiError } from "../helpers/ApiError.js";

async function getMovie(req, res, next) {
    try {
        const tmdbId = Number(req.params.tmdbId);
        if (!Number.isInteger(tmdbId)) return res.status(400).json({error: "Invalid tmdbId"});
        const data = await fetchMovieWithCredits(tmdbId);
        if (!data) throw new ApiError("Movie not found", 404);
        res.json(data);
    } catch (error) { 
        next(error); 
    }
}

async function addMovieToDb(movie_id) {
    if(!Number.isInteger(movie_id)) throw new ApiError("Invalid movie_id", 400);
    const movie = await fetchMovieWithCredits(Number(movie_id));
    if (!movie) throw new ApiError("Movie not found from TMDB", 404);
    return updateFromTmdb(movie);
}

async function removeMovieFromDb(movie_id){
    if(!Number.isInteger(movie_id)) throw new ApiError("Invalid movie_id", 400);
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
    const timeWindow = req.query.window === "week" ? "week" : "day";
    const pageRaw = req.query.page ?? "1";
    const page = Number(pageRaw);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page" });
    }

    const data = await getTrendingWithStats(timeWindow, page);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export { getMovie, addMovieToDb, removeMovieFromDb, getAll, getTrending }