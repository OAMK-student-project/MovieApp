import db from '../helpers/db.js';
    //id auto-incremented

//-----Get all favourite lists
     const getAllFavorites = async() => {
        const result = await db.query('SELECT * FROM "Favourite_lists"');
        return result.rows;
    }

//-----Get user's favourite lists
    const getFavoriteById = async(id) => {
        const result = await db.query('SELECT * FROM "Favourite_lists" WHERE user_id = $1', [id]);
        return result.rows;
    }

//-----Get list by name
    const getFavoriteByName = async(name) => {
        const result = await db.query('SELECT * FROM "Favourite_lists" WHERE name = $1', [name])
        return result.rows;
    }

//-----Get list by name and user_id
    const getByListNameAndId = async(name, user_id) => {
        const result = await db.query('SELECT * FROM "Favourite_lists" WHERE name = $1 AND user_id = $2', [name, user_id])
        return result.rows;
    }

//-----Add favlist
    //from my undestanding favouriteListId (id) should be automagically added to the database by postgres (via postgres auto-increment), thus it's "missing".
    //favouriteListData = { user_id, name }
    const addFavorite = async(favouriteListData) => {
        const timestamp = new Date();
        const result = await db.query(
            'INSERT INTO "Favourite_lists" (user_id, name, created_at) VALUES ($1, $2, $3) RETURNING *',
            [
                favouriteListData.user_id,
                favouriteListData.name,
                timestamp
            ])
        return result.rows[0];
    }

//-----Delete favlist
    //Not sure if this is functional. This should make sure that the review can only be deleted by the one who created it (user_id). favouriteListId = id which is added automatically (via postgres auto-increment)
    const deleteFavorite = async(favouriteListId, favouriteListData) => {
        const result = await db.query(
            'DELETE FROM "Favourite_lists" WHERE id = $1 AND user_id = $2 RETURNING *',
            [favouriteListId, favouriteListData.user_id])
        return result.rows[0];
    }

//-----Update favlist --- ! Only allows changing the name of the list for now !
    //favouriteListId = id which is added automatically on review creation (via postgres auto-increment).
    const updateFavorite = async(favouriteListId, favouriteListData) => {
        const result = await db.query(
            'UPDATE "Favourite_lists" SET name = $1 WHERE id = $2 AND user_id = $3',
            [
                favouriteListData.name,
                favouriteListId,
                favouriteListData.user_id
            ])
        return result.rows[0];
    }

export {
    getAllFavorites,
    getFavoriteById,
    getFavoriteByName,
    getByListNameAndId,
    addFavorite,
    deleteFavorite,
    updateFavorite
}