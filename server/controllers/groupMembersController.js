import db from "../helpers/db.js";

export async function listMembers(req, res) {
  const groupId = Number(req.params.id);
  if (!Number.isFinite(groupId)) {
    return res.status(400).json({ error: "Bad group id" });
  }

  try {
    const sql = `
      SELECT
        gm.id          AS membership_id,
        gm.user_id,
        gm.group_id,
        gm.role,
        gm.joined_at,
        u.firstname,
        u.lastname,
        u.email
      FROM "Group_members" gm
      JOIN "Users" u ON u.id = gm.user_id
      WHERE gm.group_id = $1
      ORDER BY
        CASE gm.role WHEN 'owner' THEN 0 ELSE 1 END,
        u.firstname, u.lastname
    `;
    const { rows } = await db.query(sql, [groupId]);
    return res.json({ members: rows });
  } catch (err) {
    console.error("Error fetching group members:", err);
    return res.status(500).json({ error: "Failed to load members" });
  }
}

export async function removeMember(req, res) {
  const groupId = Number(req.params.id);
  const userId = Number(req.params.userId);
  const requesterId = req.user?.id; // <-- oikea nimi

  if (!Number.isFinite(groupId) || !Number.isFinite(userId)) {
    return res.status(400).json({ error: "Bad ids" });
  }
  if (!requesterId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const me = await db.query(
      `SELECT role FROM "Group_members" WHERE group_id = $1 AND user_id = $2`,
      [groupId, requesterId]
    );

    const myRole = String(me.rows[0]?.role || "").toLowerCase();
    if (myRole !== "owner") {
      return res.status(403).json({ error: "Only owner can remove members" });
    }
    
    const target = await db.query(
      `SELECT role FROM "Group_members" WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (!target.rows.length) {
      return res.status(404).json({ error: "Member not found" });
    }

    const targetRole = String(target.rows[0].role || "").toLowerCase();
    if (targetRole === "owner") {
      return res.status(403).json({ error: "Cannot remove the owner" });
    }

    
    if (requesterId === userId) {
    return res.status(400).json({ error: "Owner cannot remove themselves" });
    }

    const del = await db.query(
      `DELETE FROM "Group_members" WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    return res.sendStatus(204); 
  } catch (err) {
    console.error("Error removing member:", err);
    return res.status(500).json({ error: "Failed to remove member" });
  }
}