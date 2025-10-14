import express from "express";
import { auth } from "../helpers/auth.js";
import {
  getShowtimes,
  addShowtime,
  removeShowtime,
} from "../controllers/groupShowtimeController.js";

const router = express.Router({ mergeParams: true });

// Get all showtimes for a group
router.get("/",  auth, getShowtimes);

// Add a showtime to a group
router.post("/", auth, addShowtime);

// Delete a specific showtime
router.delete("/:showtimeId", auth, removeShowtime);

export default router;