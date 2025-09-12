const db = require('../database');

const reviews = {


    //Get reviews
    getAll: function(callback) {
        return db.query('SELECT * FROM Reviews', callback);
    },

    //Get user's reviews
    getByUserId: function(user_id,callback) {
        return db.query('SELECT * FROM Reviews WHERE user_id=?', [user_id], callback)
    },

    //Add review
    //from my undestanding review id (id) should be automagically added to the database by postgres, thus it's "missing" from add. Tested in query. 
    // We get user_id from login/signup -> router -> model
    add: function(reviewData, callback) {
        const timestamp = new Date();
        return db.query('INSERT INTO Reviews (user_id, movie_id, review_text, rating, created_at) VALUES (?,?,?,?,?)',
            [   
                reviewData.user_id,
                reviewData.movie_id,
                reviewData.review_text,
                reviewData.rating,
                timestamp
            ], 
        callback);
    },

    //Delete review
    // Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). reviewId = id which is added automatically.
    deleteByUser: function (reviewId, user_id, callback) {
        return db.query(
            'DELETE FROM Reviews WHERE id=? AND user_id=?',
            [reviewId, user_id],
        callback);
    },

    //Update review
    //reviewId = id which is added automatically on review creation
    update: function (reviewId, user_id, reviewData, callback) {
        return db.query(
            'UPDATE Reviews SET rating=?, review_text=? WHERE id=? AND user_id=?',
            [
                reviewData.rating,
                reviewData.review_text,
                reviewId,
                user_id
            ],
            callback);
    }
    
} //END

module.exports=reviews;