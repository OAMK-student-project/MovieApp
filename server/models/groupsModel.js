import { pool } from '../helpers/db.js'

//id auto-incremented

//-----Get all groups
    const getAllGroups = async() => {
        const result = await pool.query('SELECT * FROM "Groups"')
        return result.rows;
    }

//-----Get groups by name
    const getGroupByName = async(groupData) => {
        const result = await pool.query('SELECT * FROM "Groups" WHERE name=$1', [groupData.name])
        return result.rows;
    }

//-----Get groups by name and created by (owner)
    const getByGroupNameAndCreator = async(groupData) => {
        const result = await pool.query('SELECT * FROM "Groups" WHERE name = $1 AND created_by = $2', [groupData.name, groupData.created_by])
        return result.rows;
    }

//-----Add group
    //groupData = { name, created_by }
    const addGroup = async(groupData) => {
        const timestamp = new Date();
        const result = await pool.query(
            'INSERT INTO "Groups" (name, created_by, created_at) VALUES ($1, $2, $3) RETURNING *',
            [
                groupData.name,
                groupData.created_by, //this should come from logged-in user (Users.id)
                timestamp
            ])
        return result.rows[0];
    }

//-----Update Group (only by creator)
    const updateGroup = async(id, groupData) => {
        const result = await pool.query(
            'UPDATE "Groups" SET name = $1 WHERE id = $2 AND created_by = $3 RETURNING *',
            [
                groupData.name,
                id,
                groupData.created_by //this must match with logged-in user
            ])
        return result.rows[0];
    }

//-----Delete Group
    const deleteGroup = async(id) => {
        const result = await pool.query(
            'DELETE FROM "Groups" WHERE id=$1 RETURNING *', [id])
        return result.rows[0];
    }

export { 
    getAllGroups, 
    getGroupByName, 
    getByGroupNameAndCreator, 
    addGroup, 
    updateGroup, 
    deleteGroup 
};