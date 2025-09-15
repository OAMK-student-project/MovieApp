const db = require('../database');

const reviews = {
    //id auto-incremented

//-----Get all reviews
    getAll: function (callback) {
        return db.query('SELECT * FROM Reviews', callback);
    },

//-----Get user's reviews
    getByUserId: function (user_id, callback) {
        return db.query('SELECT * FROM Reviews WHERE user_id = $1', [user_id], callback);
    },

//-----Add review
    //from my undestanding review id (id) should be automagically added to the database by postgres, thus it's "missing". Tested in query. 
    //reviewData = { user_id, movie_id, rating, review_text }
    //We (should) get user_id from login/signup -> router -> model
    add: function (reviewData, callback) {
        const timestamp = new Date();
        return db.query(
            'INSERT INTO Reviews (user_id, movie_id, review_text, rating, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                reviewData.user_id,
                reviewData.movie_id,
                reviewData.review_text,
                reviewData.rating,
                timestamp
            ],
        callback);
    },

//-----Delete review
    //Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). reviewId = id which is added automatically (via postgres auto-increment)
    deleteByUser: function (reviewId, reviewData, callback) {
        return db.query(
            'DELETE FROM Reviews WHERE id = $1 AND user_id = $2 RETURNING *',
            [reviewId, reviewData.user_id],
        callback);
    },

//-----Update review
    //reviewId = id which is added automatically on review creation (via postgres auto-increment)
    update: function (reviewId, reviewData, callback) {
        return db.query(
            'UPDATE Reviews SET rating = $1, review_text = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [
                reviewData.rating,
                reviewData.review_text,
                reviewId,
                reviewData.user_id
            ],
        callback);
    }
}; // END

module.exports = reviews;