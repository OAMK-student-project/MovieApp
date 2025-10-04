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

    console.log("DB favourites for user:", result.rows);
    return result.rows;
};

const getFavouritesByList = async (favourite_id) => {
  console.log("Querying database for favourite_id:", favourite_id);
  
  const { rows } = await pool.query(
    'SELECT id, movie_title, genre, added_at FROM "Favourite_movies" WHERE favourite_id = $1',
    [favourite_id]
  );

  // Genre is always an array (split string if stored as comma-separated)
  return rows.map((row) => ({
    id: row.id,
    title: row.movie_title,
    genres: row.genre ? row.genre.split(",").map((g) => g.trim()) : [],
    added: row.added_at,
  }));
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
const deleteFavouriteMovie = async (movieId, userId) => {
  const result = await pool.query(
    `DELETE FROM "Favourite_movies"
     USING "Favourite_lists"
     WHERE "Favourite_movies".movie_id = $1
       AND "Favourite_movies".favourite_id = "Favourite_lists".id
       AND "Favourite_lists".user_id = $2
     RETURNING *`,
    [movieId, userId]
  );

  return result.rows;
};


export { 
    getAllFavourites, 
    addFavouriteMovie, 
    deleteFavouriteMovie,
    getAllFavouritesByUser,
    getFavouritesByList
};
