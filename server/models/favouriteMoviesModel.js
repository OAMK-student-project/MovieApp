import pool from '../helpers/db.js'


//id auto-incremented

//-----Get all favourite movies
    const getAllFavourites = async() => {
       const result = await pool.query('SELECT * FROM "Favourite_movies"')
       return result.rows;
    }

//-----Add a movie to a favourite list
    //To keep me sane: favouriteMovieData = { movie_id, name, genre, favourite_id }
    const addFavouriteMovie = async(favouriteMovieData) => {
        const timestamp = new Date();
        const result = await pool.query(
            'INSERT INTO "Favourite_movies" (movie_id, name, genre, favourite_id, added_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                favouriteMovieData.movie_id,
                favouriteMovieData.name, //Does not exist in the table, maybe should add(?)
                favouriteMovieData.genre,
                favouriteMovieData.favourite_id, //Links the movie to a specific list
                timestamp
            ])
        return result.rows;
    }

//-----Delete a favourite movie (only if it belongs to the user’s list) ----- ! Not sure if this works !
    const deleteFavouriteMovie = async(favouriteMovieId, userId) => {
        const result = await pool.query(
            `DELETE FROM "Favourite_movies" 
            USING "Favourite_lists"
            WHERE "Favourite_movies".id = $1
            AND "Favourite_movies".favourite_id = "Favourite_lists".id 
            AND "Favourite_lists".user_id = $2
            RETURNING "Favourite_movies".*`,
            [favouriteMovieId, userId]
        );
        return result.rows;
    };

export { 
    getAllFavourites, 
    addFavouriteMovie, 
    deleteFavouriteMovie 
};
