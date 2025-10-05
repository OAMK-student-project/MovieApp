import axios from "axios";

const url = import.meta.env.VITE_API_URL;

// ------------------- Add list ---------------------
// Create a new favorite list
// Params:
// - newListName: string, name of the list to create
// Returns: the created list object
export async function addList(newListName) {
  if (!newListName?.trim()) throw new Error("List name is required");

  const { data } = await axios.post(`${url}/favourite-lists`, {
    list_name: newListName,
  });

  return data;
}

// ------------------- Get lists ---------------------
// Fetch all favorite lists
// No parameters
// Returns: array of lists
export async function getLists() {
  const { data } = await axios.get(`${url}/favourite-lists`);
  return data;
}

// ------------------- Edit list ---------------------
// Update the name of a favorite list
// Params:
// - listId: number/string, ID of the list to edit
// - newName: string, new name for the list
// Returns: the updated list object
export async function editList(listId, newName) {
  if (!newName?.trim()) throw new Error("List name is required");

  const { data } = await axios.patch(`${url}/favourite-lists/${listId}`, {
    name: newName,
  });

  return data;
}

// ------------------- Remove list ---------------------
// Delete a favorite list
// Params:
// - listId: number/string, ID of the list to remove
// Returns: the deleted list ID
export async function removeList(listId) {
  await axios.delete(`${url}/favourite-lists/${listId}`);
  return listId;
}

// ------------------- Fetch movies for a list ---------------------
// Get all movies in a specific favorite list
// Params:
// - favouriteId: number/string, ID of the favorite list
// Returns: array of movies in the list
export async function fetchMovies(favouriteId) {
  const { data } = await axios.get(
    `${url}/favourite/movies?favourite_id=${favouriteId}`
  );
  return data;
}

// ------------------- Share list ---------------------
// Generate a shareable link for a favorite list
// Params:
// - listId: number/string, ID of the favorite list
// Returns: shareable URL string
export async function shareList(listId) {
  const { data } = await axios.post(`${url}/favourite-lists/${listId}/share`);
  return data.share_url;
}
