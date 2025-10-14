// controllers/groupShowtimeController.js
import * as ShowtimeModel from "../models/groupShowtimeModel.js";

export const getShowtimes = async (req, res) => {
  try {
    const { groupId } = req.params;
    const showtimes = await ShowtimeModel.getShowtimesByGroup(groupId);
    res.json(showtimes);
  } catch (err) {
    console.error("Error fetching showtimes:", err);
    res.status(500).json({ message: "Failed to fetch showtimes" });
  }
};

export const addShowtime = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { movie_title, theater_name, show_date } = req.body;

    if (!movie_title || !theater_name || !show_date)
      return res.status(400).json({ message: "Missing required fields" });

    const newShowtime = await ShowtimeModel.createShowtime(
      groupId,
      movie_title,
      theater_name,
      show_date
    );

    res.status(201).json(newShowtime);
  } catch (err) {
    console.error("Error adding showtime:", err);
    res.status(500).json({ message: "Failed to add showtime" });
  }
};

export const removeShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    await ShowtimeModel.deleteShowtime(showtimeId);
    res.json({ message: "Showtime deleted successfully" });
  } catch (err) {
    console.error("Error deleting showtime:", err);
    res.status(500).json({ message: "Failed to delete showtime" });
  }
};