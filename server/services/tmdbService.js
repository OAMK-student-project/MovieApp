import "dotenv/config";

const authHeaders = {
  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  accept: "application/json",
};

const fetchMovieById = async (tmdbId) => {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}`;
  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) {
    const err = new Error(`TMDB fetch failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const fetchMovieWithCredits = async (tmdbId) => {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`;
  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) {
    const err = new Error(`TMDB details+credits failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
};

const getTrendingMovies = async (timeWindow = "day", page = 1) => {
  const url = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?page=${page}`;
  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) {
    const err = new Error(`TMDB trending failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return {
    results: data.results || [],
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
};

export { fetchMovieById, fetchMovieWithCredits, getTrendingMovies };
