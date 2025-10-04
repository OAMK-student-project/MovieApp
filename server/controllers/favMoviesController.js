import {getAllFavourites, addFavouriteMovie, deleteFavouriteMovie, getAllFavouritesByUser, getFavouritesByList } from "../models/favouriteMoviesModel.js";

const getFavourites = async (req, res,next) => {
    try {
        const result = await getAllFavourites(); //Call model
        return res.status(200).json(favourites); //Sending it back to the client
    } 
    catch (error) {
      return next(error)
    }
}

const favouritesByList = async (req, res, next) => {
  const { favourite_id } = req.query; // get favourite_id from query

  if (!favourite_id) {
    return res.status(400).json({ error: "Missing favourite_id parameter" });
  }

  try {
    console.log("Fetching movies for favourite_id:", favourite_id);

    // Call your model function that fetches movies
    const movies = await getFavouritesByList(favourite_id);

    return res.status(200).json(movies); // send movies back to client
  } catch (error) {
    console.error("error:", error);
    return next(error);
  }
};


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
  } catch (error) {
    console.error("Error adding favourite movie:", error);
    return next(error);
  }
};


const removeFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;          // from auth middleware
    const { movieId } = req.body;        // frontend sends { movieId }

    if (!movieId) {
      return res.status(400).json({ error: "Missing movieId" });
    }

    const deletedRows = await deleteFavouriteMovie(movieId, userId);

    return res.status(200).json({ deleted: deletedRows.length });
  } catch (error) {
    next(error);
  }
};



export const favouritesByUser = async (req, res, next) => {
  try {
    //DEBGUG console.log("User in favouritesByUser controller:", req.user);

    const userId = req.user?.id; // Must be set by auth middleware
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const favourites = await getAllFavouritesByUser(userId);

    return res.status(200).json(favourites);
  } catch (err) {
    console.error("Error fetching user favourites:", err);
    return res.status(500).json({ error: err.message });
  }
};



export { getFavourites, addFavourite, removeFavourite,favouritesByList }