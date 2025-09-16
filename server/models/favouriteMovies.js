const db = require('../database');

const favouriteMovies = {
    //id auto-incremented

//-----Get all favourite movies
    getAll: function (callback) {
        return db.query('SELECT * FROM Favourite_movies', callback);
    },

//-----Add a movie to a favourite list
    //To keep me sane: favouriteMovieData = { movie_id, name, genre, favourite_id }
    add: function (favouriteMovieData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Favourite_movies (movie_id, name, genre, favourite_id, added_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                favouriteMovieData.movie_id,
                favouriteMovieData.name, //Does not exist in the table, maybe should add(?)
                favouriteMovieData.genre,
                favouriteMovieData.favourite_id, //Links the movie to a specific list
                timestamp
            ],
        callback);
    },

//-----Delete a favourite movie (only if it belongs to the user’s list) ----- ! Not sure if this works !
    delete: function (favouriteMovieId, userId, callback) {
        return db.query(
            `DELETE FROM Favourite_movies 
                USING Favourite_lists
                WHERE Favourite_movies.id = $1
                AND Favourite_movies.favourite_id = Favourite_lists.id 
                AND Favourite_lists.user_id = $2
             RETURNING Favourite_movies.*`,
            [favouriteMovieId, userId],
        callback);
    }
}; // END

module.exports = favouriteMovies;
