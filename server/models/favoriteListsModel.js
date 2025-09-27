import pool from '../helpers/db.js'
    //id auto-incremented

//-----Get all favourite lists
     const getAllLists = async() => {
        const result = await pool.query('SELECT * FROM "Favourite_lists"');
        return result.rows;
    }

//-----Get user's favourite lists
    const getListByUser = async(id) => {
        const result = await pool.query('SELECT * FROM "Favourite_lists" WHERE user_id = $1', [id]);
        return result.rows;
    }

//-----Get list by name
    const getFavoriteByName = async(name) => {
        const result = await pool.query('SELECT * FROM "Favourite_lists" WHERE name = $1', [name])
        return result.rows;
    }

//-----Get list by name and user_id
    const getByListNameAndId = async(name, user_id) => {
        const result = await pool.query('SELECT * FROM "Favourite_lists" WHERE name = $1 AND user_id = $2', [name, user_id])
        return result.rows;
    }

//-----Add favlist
    //from my undestanding favouriteListId (id) should be automagically added to the database by postgres (via postgres auto-increment), thus it's "missing".
    //listData = { user_id, name }
    const addList = async(listData) => {
        const timestamp = new Date();
        const result = await pool.query(
            'INSERT INTO "Favourite_lists" (user_id, name, created_at) VALUES ($1, $2, $3) RETURNING *',
            [
                listData.user_id,
                listData.list_name,
                timestamp
            ])
        return result.rows[0];
    }

//-----Delete favlist
    //Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). favouriteListId = id which is added automatically (via postgres auto-increment)
    const deleteList = async(favouriteListId, listData) => {
        const result = await pool.query(
            'DELETE FROM "Favourite_lists" WHERE id = $1 AND user_id = $2 RETURNING *',
            [favouriteListId, listData.user_id])
        return result.rows[0];
    }

//-----Update favlist --- ! Only allows changing the name of the list for now !
    //favouriteListId = id which is added automatically on review creation (via postgres auto-increment).
    const updateList = async(favouriteListId, listData) => {
        const result = await pool.query(
            'UPDATE "Favourite_lists" SET name = $1 WHERE id = $2 AND user_id = $3',
            [
                listData.name,
                favouriteListId,
                listData.user_id
            ])
        return result.rows[0];
    }

export {
    getAllLists,
    getListByUser,
    getFavoriteByName,
    getByListNameAndId,
    addList,
    deleteList,
    updateList
}