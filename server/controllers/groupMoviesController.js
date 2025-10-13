// controllers/groupMoviesController.js
import { getMoviesById, addGroupMovies, deleteGroupMovies } from "../models/groupMoviesModel.js";
import { addMovieToDb } from "./moviesController.js";
import { ApiError } from "../helpers/ApiError.js";

// --- Hae kaikki elokuvat ryhmältä ---
export const getGroupMovies = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    if (!Number.isInteger(groupId)) throw new ApiError("Invalid group ID", 400);

    const movies = await getMoviesById(groupId);
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

// --- Lisää elokuva ryhmään ---
export const addMovieToGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    const { movie_id, genre } = req.body;

    if (!Number.isInteger(groupId) || !Number.isInteger(movie_id)) {
      throw new ApiError("Invalid group_id or movie_id", 400);
    }

    // Varmista että elokuva on tietokannassa (lisää jos ei)
    await addMovieToDb(movie_id);

    const newMovie = await addGroupMovies({
      group_id: groupId,
      movie_id,
      genre: genre || null,
    });

    res.status(201).json(newMovie);
  } catch (err) {
    next(err);
  }
};

// --- Poista elokuva ryhmästä ---
export const removeMovieFromGroup = async (req, res, next) => {
  try {
    const movieRecordId = Number(req.params.movieId);
    if (!Number.isInteger(movieRecordId)) throw new ApiError("Invalid movie record ID", 400);

    const deleted = await deleteGroupMovies(movieRecordId);
    if (!deleted) throw new ApiError("Movie not found", 404);

    res.status(200).json({ message: "Movie removed from group" });
  } catch (err) {
    next(err);
  }
};