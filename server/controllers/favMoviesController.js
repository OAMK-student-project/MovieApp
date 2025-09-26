import {getAllFavourites, addFavouriteMovie, deleteFavouriteMovie } from "../models/favouriteMoviesModel.js";

const getFavourites = async (req, res,next) => {
    try {
        const result = await getAllFavourites(); //Call model
        return res.status(200).json(favourites); //Sending it back to the client
    } 
    catch (error) {
      return next(error)
    }
}

const addFavourite = async (req,res,next) => {
    try {
        const favouriteMovieData = req.body; //Store (or copy) express request object data to variable where body contains data sent by the client
        const newfav = await addFavouriteMovie(favouriteMovieData); //call model with data for insert
        return res.status(201).json(newFav);
    } 
    catch(error) {
        return next(error)
    }
}

const removeFavourite = async(req,res,next) => {
    try {
        const favouriteMovieId = req.params.id;
        const userId = req.body.userId; //Should come from auth
        const deleteFavourite = await deleteFavouriteMovie(favouriteMovieId,userId)
        return res.status(201).json(deleteFavourite);
    } 
    catch(error) {
        return next(error)
    }

}

export { getFavourites, addFavourite, removeFavourite }