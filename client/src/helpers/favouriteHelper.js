import axios from "axios";

export async function addFavorites(favouriteMovieData, accessToken) {
  if (!accessToken) throw new Error("User is not authenticated");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/favourite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(favouriteMovieData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add movie: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error adding favourite:", err);
    throw err;
  }
};

export async function removeFavorite(movieId) {
  try {
    const response = await fetch(`/favourite/${movieId}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to remove movie")
    return await response.json()
  } catch (err) {
    console.error("Error removing favourite:", err)
    throw err
  }
}

export async function getLists(userID, accessToken) {
  if (!userID || !accessToken) return [];

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/favourite-lists`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Fetched lists:", data);
    return data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
}

export async function favouritesByUser(accessToken) {
  if (!accessToken) return [];

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/favourite`, {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Failed to fetch favourites");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}


