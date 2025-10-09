import express from "express";
import { auth } from "../helpers/auth.js";
import {
  getGroupMovies,
  addMovieToGroup,
  removeMovieFromGroup
} from "../controllers/groupMoviesController.js";

const router = express.Router({ mergeParams: true }); // mergeParams allows :groupId from parent route

// GET /groups/:groupId/movies
router.get("/", auth, getGroupMovies);

// POST /groups/:groupId/movies
router.post("/", auth, addMovieToGroup);

// DELETE /groups/:groupId/movies/:id
router.delete("/:movieId", auth, removeMovieFromGroup);

export default router;