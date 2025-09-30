import {addList, deleteList, getListByUser } from "../models/favoriteListsModel.js";

// Get all lists for the authenticated user
const getLists = async (req, res, next) => {
  try {
    const userId = req.user?.id; //get user ID from token
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await getListByUser(userId); //model expects userId
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getLists:", error);
    return next(error);
  }
};

const addLists = async (req, res, next) => {
  try {
    const userId = req.user?.id; // get user from JWT
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { list_name } = req.body; // extract list_name explicitly
    if (!list_name) return res.status(400).json({ error: "List name is required" });

    // pass exact keys expected by the model
    const newFav = await addList({ user_id: userId, list_name });

    return res.status(201).json(newFav);
  } catch (error) {
    console.error("Error in addLists:", error);
    return next(error);
  }
};


// Remove a favorite list
const removeLists = async (req, res, next) => {
  
  try {
    const listId = req.params.id;
    const userId = req.user?.id; // from token middleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedFav = await deleteList(listId, userId);

    if (!deletedFav) {
      return res.status(404).json({ error: "List not found or not owned by user" });
    }

    return res.status(200).json({ message: "List deleted", deleted: deletedFav });
  } catch (error) {
    console.error("Error in removeLists:", error);
    return next(error);
  }
};


export { getLists, addLists, removeLists }