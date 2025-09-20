import { pool } from '../helpers/db.js'
//id auto-incremented

//-----Get all requests from table
    const getAllRequests = async() => {
        const result = await pool.query('SELECT * FROM "Group_join_requests"')
        return result.rows;
    }

//-----Get requests by group id
    const getRequestsById = async(groupJoinId) => {
        const result = await pool.query('SELECT * FROM "Group_join_requests" WHERE group_id=$1', [groupJoinId])
        return result.rows;
    }

//-----Get join requests from a specific group and return group info
    const getRequestsByGroup = async(groupJoinId) => {
        const result = await pool.query(
            'SELECT * FROM "Group_join_requests" gjr ' + //gjr and g are just aliases, for example: "Group_join_requests" gjr <- defines the alias
            'LEFT JOIN "Groups" g ON gjr.group_id = g.id ' +
            'WHERE gjr.group_id = $1',
            [groupJoinId])
        return result.rows;
    }
 
//-----Add request
    //groupJoinData = { group_id, requester_id, status }
    const addRequest = async(groupJoinData) => {
        const timestamp = new Date();
        const result = await pool.query(
            'INSERT INTO "Group_join_requests" (group_id, requester_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupJoinData.group_id,
                groupJoinData.requester_id,
                groupJoinData.status,
                timestamp
            ])
        return result.rows[0];
    }


//-----Update request
    const updateRequest = async(groupJoinId, groupJoinData) => {
        const result = await pool.query(
            'UPDATE "Group_join_requests" SET status = $1 WHERE id = $2 RETURNING *', [ groupJoinData.status, groupJoinId ])
            return result.rows[0];
    }

//-----Delete request
    const deleteRequest = async(groupJoinId) => {
        const result = await pool.query(
            'DELETE FROM "Group_join_requests" WHERE id=$1 RETURNING *', [groupJoinId])
        return result.rows[0];
    }

export {
  getAllRequests,
  getRequestsById,
  getRequestsByGroup,
  addRequest,
  updateRequest,
  deleteRequest
};