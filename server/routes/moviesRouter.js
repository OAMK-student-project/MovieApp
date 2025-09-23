import express from "express";

const router = express.Router();
const TMDB_API_URL = "https://api.themoviedb.org/3";

// search endpoint
router.get("/", async (req, res) => {
  try {
    const { q, genre, director } = req.query;
    let url = "";

    if (q) {
      url = `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`;
    } else if (genre) {
      url = `${TMDB_API_URL}/discover/movie?with_genres=${encodeURIComponent(genre)}&language=en-US&page=1`;
    } else if (director) {
      url = `${TMDB_API_URL}/search/person?query=${encodeURIComponent(director)}&language=en-US`;
    } else {
      url = `${TMDB_API_URL}/movie/popular?language=en-US&page=1`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "TMDB fetch failed" });
    }

    const data = await response.json();


    // Jos haettiin ohjaajaa etsitään id:llä
    if (director) {
      const personId = data.results[0]?.id;
      if (personId) {
        const creditsRes = await fetch(
          `${TMDB_API_URL}/person/${personId}/movie_credits?language=en-US`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` },
          }
        );
        const credits = await creditsRes.json();
        // Suodatetaan vain ohjaajan rooli
        const directedMovies = credits.crew.filter(c => c.job === "Director");
        return res.json({ results: directedMovies });
      }
      return res.json({ results: [] });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); 

export default router;