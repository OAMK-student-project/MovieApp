import express from "express";
import {
  getShowtimes,
  addShowtime,
  removeShowtime,
} from "../controllers/groupShowtimeController.js";

const router = express.Router({ mergeParams: true });

// Get all showtimes for a group
router.get("/", getShowtimes);

// Add a showtime to a group
router.post("/", addShowtime);

// Delete a specific showtime
router.delete("/:showtimeId", removeShowtime);

export default router;