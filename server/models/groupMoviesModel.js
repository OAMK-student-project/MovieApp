/*import db from '../helpers/db.js';
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


//-----Delete movie
    const deleteGroupMovies = async(id) => {
        const result = await db.query(
            'DELETE FROM Group_movies WHERE id=$1 RETURNING *', [id])
            return result.rows;
    }

export {  getAllMovies, getMoviesById, addGroupMovies, deleteGroupMovies }*/

import db from '../helpers/db.js';

// ----- Get all group movies -----
const getAllMovies = async () => {
  const result = await db.query('SELECT * FROM "Group_movies"');
  return result.rows;
};

// ----- Get movies by group ID -----
const getMoviesById = async (groupId) => {
  const result = await db.query('SELECT * FROM "Group_movies" WHERE group_id = $1', [groupId]);
  return result.rows;
};

// ----- Add a new movie to a group -----
// groupMoviesData = { group_id, movie_id, genre }
const addGroupMovies = async (groupMoviesData) => {
  const timestamp = new Date();

  //  Korjattu virhe: oli `movies_id`, pitäisi olla `movie_id`
  const result = await db.query(
    'INSERT INTO "Group_movies" (group_id, movie_id, genre, added_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [
      groupMoviesData.group_id,
      groupMoviesData.movie_id,
      groupMoviesData.genre,
      timestamp
    ]
  );

  return result.rows[0];
};

// ----- Delete a movie from group -----
const deleteGroupMovies = async (id) => {
  const result = await db.query('DELETE FROM "Group_movies" WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export { getAllMovies, getMoviesById, addGroupMovies, deleteGroupMovies };