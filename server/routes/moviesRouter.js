// moviesRouter.js
import express from "express";
import axios from "axios";
import { getMovie, getAll, getTrending } from "../controllers/moviesController.js";

const router = express.Router();
const TMDB_API_URL = "https://api.themoviedb.org/3";

// Axios instance for TMDB API calls
const tmdb = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
});


// Trending and reviewed

router.get("/trending", getTrending);
router.get("/allreviewed", getAll);


// Search & popular movies

router.get("/", async (req, res) => {
  try {
    const { q, genre, director } = req.query;
    let url = "";

    if (q) {
      url = `/search/movie?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`;
    } else if (genre) {
      url = `/discover/movie?with_genres=${encodeURIComponent(genre)}&language=en-US&page=1`;
    } else if (director) {
      url = `/search/person?query=${encodeURIComponent(director)}&language=en-US`;
    } else {
      url = `/movie/popular?language=en-US&page=1`;
    }

    const { data } = await tmdb.get(url);

    // Handle director search separately
    if (director) {
      const personId = data.results[0]?.id;
      if (personId) {
        const { data: credits } = await tmdb.get(
          `/person/${personId}/movie_credits?language=en-US`
        );
        const directedMovies = credits.crew.filter(c => c.job === "Director");
        return res.json({ results: directedMovies });
      }
      return res.json({ results: [] });
    }

    res.json(data);
  } catch (err) {
    console.error("TMDB search error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// Single movie by TMDB ID
// Must come last to avoid conflicts with /trending, /allreviewed, or /
router.get("/:tmdbId", getMovie);

export default router;