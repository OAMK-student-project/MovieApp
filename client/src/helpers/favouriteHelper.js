import { getMovieDetails } from "../services/movieService"

// favouriteHelper.js
export async function addFavourites(favouriteMovieData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/favourites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favouriteMovieData),
    })

    if (!response.ok) throw new Error("Failed to add movie")
    return await response.json()
  } catch (err) {
    console.error("Error adding favourite:", err)
    throw err
  }
}

export async function removeFavourite(movieId) {
  try {
    const response = await fetch(`/api/favourites/${movieId}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to remove movie")
    return await response.json()
  } catch (err) {
    console.error("Error removing favourite:", err)
    throw err
  }
}
