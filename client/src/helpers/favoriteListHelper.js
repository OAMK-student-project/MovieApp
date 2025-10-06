import axios from "axios";

const url = import.meta.env.VITE_API_URL;

// ------------------- Add list ---------------------
// Create a new favorite list

export async function addList(newListName) {
  if (!newListName?.trim()) throw new Error("List name is required");

  const { data } = await axios.post(`${url}/favourite-lists`, {
    list_name: newListName,
  });

  return data;
}

// ------------------- Get lists ---------------------
// Fetch all favorite lists

export async function getLists() {
  const { data } = await axios.get(`${url}/favourite-lists`);
  return data;
}

// ------------------- Edit list ---------------------
// Update the name of a favorite list

export async function editList(listId, newName) {
  if (!newName?.trim()) throw new Error("List name is required");

  const { data } = await axios.patch(`${url}/favourite-lists/${listId}`, {
    name: newName,
  });

  return data;
}

// ------------------- Remove list ---------------------
// Delete a favorite list

export async function removeList(listId) {
  await axios.delete(`${url}/favourite-lists/${listId}`);
  return listId;
}

// ------------------- Fetch movies for a list ---------------------
// Get all movies in a specific favorite list

export async function fetchMovies(favouriteId) {
  const { data } = await axios.get(
    `${url}/favourite/movies?favourite_id=${favouriteId}`
  );
  return data;
}

// ------------------- Share list ---------------------
// Generate a shareable link for a favorite list

export async function shareList(listId) {
  const { data } = await axios.post(`${url}/favourite-lists/${listId}/share`);
  return data.share_url;
}
