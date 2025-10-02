import db from '../helpers/db.js';
//id auto-incremented

//-----Get all requests from table
    const getAllRequests = async() => {
        const result = await db.query('SELECT * FROM "Group_join_requests"')
        return result.rows;
    }

//-----Get requests by group id
    const getRequestsById = async(groupJoinId) => {
        const result = await db.query('SELECT * FROM "Group_join_requests" WHERE group_id=$1', [groupJoinId])
        return result.rows;
    }

/*//-----Get join requests from a specific group and return group info
    const getRequestsByGroup = async(groupJoinId) => {
        const result = await db.query(
            'SELECT * FROM "Group_join_requests" gjr ' + //gjr and g are just aliases, for example: "Group_join_requests" gjr <- defines the alias
            'LEFT JOIN "Groups" g ON gjr.group_id = g.id ' +
            'WHERE gjr.group_id = $1',
            [groupJoinId])
        return result.rows;
    }*/

//-----Get join requests from a specific group and return group info
const getRequestsByGroup = async (groupJoinId) => {
  try {
    const result = await db.query(
      `SELECT 
         gjr.id AS request_id,
         gjr.status,
         gjr.created_at,
         gjr.requester_id,
         u.email,
         u.firstname,
         u.lastname,
         g.name AS group_name
       FROM "Group_join_requests" gjr
       LEFT JOIN "Users" u ON gjr.requester_id = u.id
       JOIN "Groups" g ON gjr.group_id = g.id
       WHERE gjr.group_id = $1`,
      [groupJoinId]
    );
    console.log("SQL result:", result.rows);
    return result.rows;
  } catch (err) {
    console.error("Error in getRequestsByGroup:", err);
    throw err; // jotta middleware palauttaa 500
  }
};



//-----Add request
// groupJoinData = { group_id, requester_id, status }
const addRequest = async (groupJoinData) => {
  const timestamp = new Date();

  // Tarkista onko jo olemassa
  const existing = await db.query(
    'SELECT 1 FROM "Group_join_requests" WHERE group_id = $1 AND requester_id = $2',
    [groupJoinData.group_id, groupJoinData.requester_id]
  );

  if (existing.rowCount > 0) {
    throw new Error("User has already sent a join request to this group");
  }

  const result = await db.query(
    'INSERT INTO "Group_join_requests" (group_id, requester_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [
      groupJoinData.group_id,
      groupJoinData.requester_id,
      groupJoinData.status,
      timestamp
    ]
  );

  return result.rows[0];
};

 
/*//-----Add request
    //groupJoinData = { group_id, requester_id, status }
    const addRequest = async(groupJoinData) => {
        const timestamp = new Date();
        const result = await db.query(
            'INSERT INTO "Group_join_requests" (group_id, requester_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                groupJoinData.group_id,
                groupJoinData.requester_id,
                groupJoinData.status,
                timestamp
            ])
        return result.rows[0];
    }*/


//-----Update request
    const updateRequest = async(groupJoinId, groupJoinData) => {
        const result = await db.query(
            'UPDATE "Group_join_requests" SET status = $1 WHERE id = $2 RETURNING *', [ groupJoinData.status, groupJoinId ])
            return result.rows[0];
    }

//-----Delete request
    const deleteRequest = async(groupJoinId) => {
        const result = await db.query(
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