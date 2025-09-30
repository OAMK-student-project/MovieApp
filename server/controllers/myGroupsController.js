import db from "../helpers/db.js";

// Fetch all groups a user belongs to
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.params.id;

   const result = await db.query(
  `SELECT DISTINCT g.*
   FROM "Group_join_requests" gjr
   JOIN "Groups" g ON gjr.group_id = g.id
   WHERE gjr.requester_id = $1 `, // add this status later AND gjr.status = 'approved'
  [userId]
);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Server error" });
  }
};