import { addList, deleteList, getListByUser, updateList, getListById, shareFavoriteList, getListByShareUuid, getMoviesByListId } from "../models/favoriteListsModel.js";
import { v4 as uuidv4 } from "uuid";

// ------------------- Get all lists for user -------------------
const getLists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const result = await getListByUser(userId);
    return res.status(200).json(result);
  } 
  catch (error) {
    console.error("Error in getLists:", error);
    return next(error);
  }
};

// ------------------- Add new list -------------------
const addLists = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { list_name } = req.body;
    if (!list_name) return res.status(400).json({ error: "List name is required" });

    const newFav = await addList({ user_id: userId, list_name });
    return res.status(201).json(newFav);
  } 
  catch (error) {
    console.error("Error in addLists:", error);
    return next(error);
  }
};

// ------------------- Remove a list -------------------
const removeLists = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const deletedFav = await deleteList(listId, userId);
    if (!deletedFav) return res.status(404).json({ error: "List not found or not owned by user" });

    return res.status(200).json({ message: "List deleted", deleted: deletedFav });
  } 
  catch (error) {
    console.error("Error in removeLists:", error);
    return next(error);
  }
};

// ------------------- Update a list -------------------
const updateLists = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updatedList = await updateList(listId, { name, user_id: userId });
    if (!updatedList) return res.status(404).json({ error: "List not found or not owned by user" });

    return res.status(200).json({ message: "List edited", edited: updatedList });
  } 
  catch (error) {
    console.error("Error in updateList:", error);
    return next(error);
  }
};

// ------------------- Share a list -------------------
const shareList = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const list = await getListById(listId, userId);
    if (!list) return res.status(404).json({ error: "List not found or not owned by user" });

    const share_uuid = list.share_uuid || uuidv4();
    await shareFavoriteList(listId, share_uuid);

    const shareUrl = `${process.env.FRONTEND_URL}/shared/favourites/${share_uuid}`;
    return res.status(200).json({ message: "List shared successfully", share_url: shareUrl });
  } 
  catch (error) {
    console.error("Error in shareList:", error);
    return next(error);
  }
};

// ------------------- Get shared list -------------------
const getSharedList = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const list = await getListByShareUuid(uuid);
    if (!list || !list.is_shared) return res.status(404).json({ error: "Shared list not found" });

    const movies = await getMoviesByListId(list.id);
    return res.status(200).json({ list, movies });
  } 
  catch (err) {
    console.error("Error in getSharedList:", err);
    next(err);
  }
};

export { getLists, addLists, removeLists, updateLists, shareList, getSharedList };
