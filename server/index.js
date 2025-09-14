import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());


const TMDB_API_URL = "https://api.themoviedb.org/3";

// search endpoint (backend lisää Bearer-tokenin itse)

app.get("/api/movies", async (req, res) => {
  try {
    const { q, genre, director } = req.query;
    let url = "";

    if (q) {
      url = `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=1`;
    } else if (genre) {
      url = `${TMDB_API_URL}/discover/movie?with_genres=${encodeURIComponent(genre)}&language=en-US&page=1`;
    } else if (director) {
      // TMDB ei suoraan tue ohjaajahakua
      url = `${TMDB_API_URL}/search/person?query=${encodeURIComponent(director)}&language=en-US`;
    } else {
      // Oletuksena suosituimmat
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
    
    // Jos haettiin ohjaaja, pitää yhdistää elokuvat (data.results on henkilöitä)
    if (director) {
      const personId = data.results[0]?.id;
      if (personId) {
        const moviesByDirectorRes = await fetch(
          `${TMDB_API_URL}/discover/movie?with_crew=${personId}&language=en-US`,
          { headers: { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` } }
        );
        const moviesByDirector = await moviesByDirectorRes.json();
        return res.json(moviesByDirector);
      }
      return res.json({ results: [] });
    }

    res.json(data); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));


app.use((req, res, next) => {
    next({
        status: 404, 
        message: "Not found"
    });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: { message: err.message, status: statusCode }
  });
});


const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(` Backend running at http://localhost:${port}`)
);






/*import express from "express";
import cors from "cors";
import "dotenv/config";

//Router imports here

const app = express();
app.use(cors());
app.use(express.json());
//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));

const port = process.env.PORT || 3001;


app.use((req, res, next) => {
    next({
        status: 404, 
        message: "Not found"
    });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: { message: err.message, status: statusCode }
  });
});

app.listen(port, ()=>console.log(`Server running at port ${port}`));*/


