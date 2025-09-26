import db from '../helpers/db.js';
//id auto-incremented

//-----Get all Group Movies
    const getAllMovies = async() => {
        const result = await db.query('SELECT * FROM "Group_movies"')
        return result.rows;
    }

//-----Get Group Movies by group id
    const getMoviesById = async(groupMoviesId) => {
        const result = await db.query('SELECT * FROM "Group_movies" WHERE group_id=$1', [groupMoviesId])
        return result.rows;
    }

//-----Add Group Movies
    //groupMoviesData = { group_id, movie_id, genre }
    const addGroupMovies = async(groupMoviesData) => {
        const timestamp = new Date();
        const result = await db.query(
            'INSERT INTO "Group_movies" (group_id, movie_id, genre, added_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupMoviesData.group_id,
                groupMoviesData.movies_id,
                groupMoviesData.genre,
                timestamp
            ])
        return result.rows;
    }
/*
//-----Update Group Movies ---- Any reason for an update in this table?
    const updateGroupMovies = async(id, groupMoviesData) => {
        const result = await db.query(
            'UPDATE "Group_movies" SET X = $1 WHERE Y = $2 RETURNING *',
            [
                groupMemberData.X,
                id,
            ])
        return result.rows;
    }
*/
//-----Delete movie
    const deleteGroupMovies = async(id) => {
        const result = await db.query(
            'DELETE FROM Group_movies WHERE id=$1 RETURNING *', [id])
            return result.rows;
    }

export {  getAllMovies, getMoviesById, addGroupMovies, deleteGroupMovies }