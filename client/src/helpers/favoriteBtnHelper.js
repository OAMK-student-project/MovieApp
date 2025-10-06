import axios from "axios";
const url = import.meta.env.VITE_API_URL;

// ------------------- Add favourite ---------------------
// Add a movie to a favorite list

export async function addFavorites(favouriteMovieData) {
  try {
    const { data } = await axios.post(
      `${url}/favourite`,
      favouriteMovieData,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (err) {
    console.error("Error adding favourite:", err);
    throw err;
  }
}

// ------------------- Remove favourite ---------------------
// Remove a movie from favorites by movieId

export async function removeFavorite(movieId) {
  try {
    const { data } = await axios.delete(`${url}/favourite`, {
      headers: { "Content-Type": "application/json" },
      data: { movieId },
    });
    return data;
  } catch (err) {
    console.error("Error removing favourite:", err);
    throw err;
  }
}

// ------------------- Get favourite lists ---------------------
// Get all favorite lists for the user

export async function getLists() {
  try {
    const { data } = await axios.get(`${url}/favourite-lists`, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err) {
    console.error("Error fetching lists:", err);
    return [];
  }
}

// ------------------- Get user favourites ---------------------
// Get all favorites for the user

export async function favouritesByUser() {
  try {
    const { data } = await axios.get(`${url}/favourite`, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err) {
    console.error("Error fetching favourites:", err);
    return [];
  }
}

// ------------------- Add favourite movie ---------------------
// Add a movie to a specific favorite list

export async function addFavoriteMovie(movie, listId) {
  let genres = movie.genres;

  // If genres not available, fetch from movie details API
  if (!genres || genres.length === 0) {
    const { data } = await axios.get(`${url}/api/movie/${movie.id}`);
    genres = data.genres || [];
  }

  const genreString = genres.length
    ? genres.map(g => g.name).join(", ")
    : movie.genre_ids?.join(", ") || "Unknown";

  const favouriteMovieData = {
    movie_id: movie.id,
    genre: genreString,
    favourite_id: listId,
    movie_title: movie.title,
  };

  return addFavorites(favouriteMovieData); // Reuse existing helper
}

// ------------------- Remove favourite movie ---------------------
// Remove a movie from a specific favourite list by movieId

export async function removeFavoriteMovie(movieId) {
  return axios.delete(`${url}/favourite`, {
    headers: { "Content-Type": "application/json" },
    data: { movieId },
  });
}
