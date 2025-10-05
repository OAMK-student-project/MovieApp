import { getAllFavourites, addFavouriteMovie, deleteFavouriteMovie, getAllFavouritesByUser, getFavouritesByList } from "../models/favouriteMoviesModel.js";

// ------------------- Get all favourites -------------------
const getFavourites = async (req, res, next) => {
  try {
    const favourites = await getAllFavourites(); 
    return res.status(200).json(favourites);
  } 
  catch (error) {
    next(error);
  }
};

// ------------------- Get favourites by list -------------------
const favouritesByList = async (req, res, next) => {
  const { favourite_id } = req.query;

  if (!favourite_id) {
    return res.status(400).json({ error: "Missing favourite_id parameter" });
  }

  try {
    const movies = await getFavouritesByList(favourite_id);
    return res.status(200).json(movies);
  } 
  catch (error) {
    return next(error);
  }
};

// ------------------- Add favourite movie -------------------
const addFavourite = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { movie_id, movie_title, genre, favourite_id } = req.body;
    if (!movie_id || !movie_title || !favourite_id)
      return res.status(400).json({ error: "Missing required fields" });

    const favouriteMovieData = { movie_id, movie_title, genre, favourite_id };
    const newFav = await addFavouriteMovie(favouriteMovieData);

    return res.status(201).json(newFav[0]);
  } 
  catch (error) {
    return next(error);
  }
};

// ------------------- Remove favourite movie -------------------
const removeFavourite = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ error: "Missing movieId" });

    const deletedRows = await deleteFavouriteMovie(movieId, req.user.id);
    return res.status(200).json({ success: true, deletedCount: deletedRows.length });
  } 
  catch (err) {
    next(err);
  }
};

// ------------------- Get favourites by user -------------------
const favouritesByUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const favourites = await getAllFavouritesByUser(userId);
    return res.status(200).json(favourites);
  } 
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export { getFavourites, addFavourite, removeFavourite, favouritesByList, favouritesByUser };
