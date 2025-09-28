import pool from '../helpers/db.js'


//id auto-incremented

//-----Get all favourite movies
    const getAllFavourites = async() => {
       const result = await pool.query('SELECT * FROM "Favourite_movies"')
       return result.rows;
    }

    const getAllFavouritesByUser = async (userId) => {
    const result = await pool.query(
        `SELECT "Favourite_movies".*, "Favourite_lists".name AS list_name
        FROM "Favourite_movies"
        JOIN "Favourite_lists" ON "Favourite_movies".favourite_id = "Favourite_lists".id
        WHERE "Favourite_lists".user_id = $1
        ORDER BY "Favourite_movies".added_at DESC`,
        [userId]
    );

    console.log("DB favourites for user:", result.rows); // 👀 log here
    return result.rows;
    };


//-----Add a movie to a favourite list
    //To keep me sane: favouriteMovieData = { movie_id, movie_title, genre, favourite_id }
const addFavouriteMovie = async(favouriteMovieData) => {
  const timestamp = new Date();
  const result = await pool.query(
    'INSERT INTO "Favourite_movies" (movie_id, genre, favourite_id, added_at, movie_title) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (movie_id, favourite_id) DO NOTHING RETURNING *',
    [
      favouriteMovieData.movie_id,
      favouriteMovieData.genre,
      favouriteMovieData.favourite_id,
      timestamp,
      favouriteMovieData.movie_title,
    ]
  );
  return result.rows;
};

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
    deleteFavouriteMovie,
    getAllFavouritesByUser
};
