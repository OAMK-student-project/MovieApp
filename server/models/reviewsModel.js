


import db from '../helpers/db.js'

//id auto-incremented

//-----Get all reviews
    const getAllReviews = async() => {
        const result = await db.query('SELECT * FROM "Reviews"');


        return result.rows;
    }

    const getAllReviewsTmdbIds = async() => {
        const result = await db.query(`SELECT movie_id FROM "Reviews"`);

        return result.rows;
    }

//-----Get user's reviews

    

    const getReviewsByUserId = async(userID) => {
        const result = await db.query('SELECT * FROM "Reviews" WHERE user_id = $1', [userID]);

        return result.rows;
    }
//-----Get movie's reviews with user infos
    async function getReviewsWithUserByMovieId(movie_id) {
    const query = `
        SELECT r.id, r.user_id, r.movie_id, r.rating, r.review_text, r.created_at,
            u.firstname, u.lastname, u.email
        FROM "Reviews" r
        JOIN "Users" u ON u.id = r.user_id
        WHERE r.movie_id = $1
        ORDER BY r.created_at DESC;`;
    const { rows } = await db.query(query, [movie_id]);
    return rows;}

//-----Add review
    //from my undestanding review id (id) should be automagically added to the database by postgres, thus it's "missing". Tested in query. 
    //reviewData = { user_id, movie_id, rating, review_text }
    //We (should) get user_id from login/signup
    const addReview = async(reviewData) => {
        const timestamp = new Date();
        const result = await db.query(
            'INSERT INTO "Reviews" (user_id, movie_id, review_text, rating, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                reviewData.userID,
                reviewData.movieID,
                reviewData.reviewText,
                reviewData.rating,
                timestamp
            ])
        return result.rows[0];
    }

//-----Delete review
    //Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). reviewId = id which is added automatically (via postgres auto-increment)

    const deleteReview = async(reviewID, userID) => {

        const result = await db.query(
            'DELETE FROM "Reviews" WHERE id = $1 AND user_id = $2 RETURNING *',
            [reviewID, userID])
        return result.rows[0];
    }

//-----Update review
    //reviewId = id which is added automatically on review creation (via postgres auto-increment)

    const updateReview = async(reviewID, reviewData) => {

        const result = await db.query(
            'UPDATE "Reviews" SET rating = $1, review_text = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [
                reviewData.rating,
                reviewData.reviewText,
                reviewID,
                reviewData.userID
            ])
        return result.rows[0];
    }

// --- listojen rikastus yhdellä SQL:llä ---
    async function getStatsForIds(ids) {
        if (!ids.length) return new Map();
        const { rows } = await db.query(
            `SELECT movie_id AS movie_id,
                    COUNT(*)::int AS review_count,
                    ROUND(AVG(rating)::numeric, 2) AS avg_rating
            FROM "Reviews"
            WHERE movie_id = ANY($1::int[])
            GROUP BY movie_id`,
            [ids]
        );
        return new Map(rows.map(r => [Number(r.movie_id), r]));
    }

    const statisticsInDatabase = async() => {
        await db.query(
        `SELECT COUNT(*)::int AS review_count,
                ROUND(AVG(rating)::numeric, 2) AS avg_rating
        FROM "Reviews"
        WHERE movie_id = $1`,
        [tmdbId]
    );
        return statisticsInDatabase.rows[0] || { review_count: 0, avg_rating: null };
    }

    const myReviewInDatabase = async () => {
        await db.query(
            `SELECT id, rating, review_text, created_at
            FROM "Reviews"
            WHERE user_id = $1 AND movie_id = $2
            LIMIT 1`,
            [userId, tmdbId]
            );
            return myReviewInDatabase.rows[0] || null;
    }

export {
    getAllReviews,
    getAllReviewsTmdbIds,
    getReviewsByUserId,
    getReviewsWithUserByMovieId,
    addReview,
    deleteReview,
    updateReview,
    getStatsForIds,
    statisticsInDatabase,
    myReviewInDatabase
}