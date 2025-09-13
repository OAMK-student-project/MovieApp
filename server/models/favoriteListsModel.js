const db = require('../database');

const favouriteLists = {
    //id auto-incremented

    // Get all favourite lists
     getAll: function (callback) {
        return db.query('SELECT * FROM Favourite_lists', callback);
    },

    // Get user's favourite lists
    getByUserId: function (user_id, callback) {
        return db.query('SELECT * FROM Favourite_lists WHERE user_id = $1', [user_id], callback);
    },

    // Get list by name
    getByListName: function (name, callback) {
        return db.query('SELECT * FROM Favourite_lists WHERE name = $1', [name], callback);
    },

    // Get list by name and user_id
    getByListNameAndId: function (name, user_id, callback) {
        return db.query('SELECT * FROM Favourite_lists WHERE name = $1 AND user_id = $2', [name, user_id], callback);
    },

    //Add favlist
    //from my undestanding favouriteListId (id) should be automagically added to the database by postgres (via postgres auto-increment), thus it's "missing".
    add: function (favouriteListData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Favourite_lists (user_id, name, created_at) VALUES ($1, $2, $3) RETURNING *',
            [
                favouriteListData.user_id,
                favouriteListData.name,
                timestamp
            ],
        callback);
    },

    //Delete favlist
    //Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). favouriteListId = id which is added automatically (via postgres auto-increment)
    deleteByUser: function (favouriteListId, favouriteListData, callback) {
        return db.query(
            'DELETE FROM Favourite_lists WHERE id = $1 AND user_id = $2 RETURNING *',
            [favouriteListId, favouriteListData.user_id],
        callback);
    },

    //Update favlist --- ! Only allows changing the name of the list for now !
    //favouriteListId = id which is added automatically on review creation (via postgres auto-increment).
    update: function (favouriteListId, favouriteListData, callback) {
        return db.query(
            'UPDATE Favourite_lists SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [
                favouriteListData.name,
                favouriteListId,
                favouriteListData.user_id
            ],
        callback);
    }
}; // END

module.exports = favouriteLists;