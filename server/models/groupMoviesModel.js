const db = require('../database');

const groupMovies = {
    //id auto-incremented

//-----Get all Group Movies
    getAll: function(callback) {
        return db.query('SELECT * FROM Group_movies', callback);
    },

//-----Get Group Movies by group id
    getById: function(groupMoviesId,callback) {
        return db.query('SELECT * FROM Group_movies WHERE group_id=$1', [groupMoviesId],callback)
    },

//-----Add Group Movies
    //groupMoviesData = { group_id, movie_id, genre }
    add: function (groupMoviesData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Group_movies (group_id, movie_id, genre, added_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupMoviesData.group_id,
                groupMoviesData.movies_id,
                groupMoviesData.genre,
                timestamp
            ],
        callback);
    },
/*
//-----Update Group Movies ---- Any reason for an update in this table?
    update: function(id, groupMoviesData, callback) {
        return db.query(
            'UPDATE Group_movies SET X = $1 WHERE Y = $2 RETURNING *',
            [
                groupMemberData.X,
                id,
            ], 
        callback);
    },
*/
//-----Delete movie
    delete: function(id, callback) {
        return db.query(
            'DELETE FROM Group_movies WHERE id=$1 RETURNING *', [id],
            callback);
    }

}; //END
module.exports = groupMovies;