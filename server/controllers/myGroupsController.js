//myGroupsController.js
import db from "../helpers/db.js";

// Fetch all groups a logged-in user belongs to
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT g.*
       FROM "Groups" g
       JOIN "Group_members" gm ON g.id = gm.group_id
       WHERE gm.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Server error" });
  }
};