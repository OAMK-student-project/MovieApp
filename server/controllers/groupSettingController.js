import db from "../helpers/db.js";

export async function getGroupSettings(req, res) {
  const groupId = Number(req.params.id);
  if (!Number.isFinite(groupId)) {
    return res.status(400).json({ error: "Bad group id" });
  }

  try {
    const { rows } = await db.query(
      `SELECT theme_color, emoji, note
       FROM "Groups"
       WHERE id = $1`,
      [groupId]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Group not found" });
    }
    return res.json(rows[0]);
  } catch (e) {
    console.error("getGroupSettings error:", e);
    return res.status(500).json({ error: "Failed to load settings" });
  }
}

export async function updateGroupSettings(req, res) {
  const groupId = Number(req.params.id);
  if (!Number.isFinite(groupId)) {
    return res.status(400).json({ error: "Bad group id" });
  }

  const { theme_color = null, emoji = null, note = null } = req.body ?? {};

  try {
    const roleRes = await db.query(
      `SELECT role
       FROM "Group_members"
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, req.user.id]
    );
    const myRole = String(roleRes.rows[0]?.role || "").toLowerCase();
    if (myRole !== "owner") {
      return res.status(403).json({ error: "Only owner can update settings" });
    }
    const { rows } = await db.query(
      `UPDATE "Groups"
         SET theme_color = COALESCE($2, theme_color),
             emoji       = COALESCE($3, emoji),
             note        = COALESCE($4, note)
       WHERE id = $1
       RETURNING theme_color, emoji, note`,
      [groupId, theme_color, emoji, note]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Group not found" });
    }
    return res.json(rows[0]);
  } catch (e) {
    console.error("updateGroupSettings error:", e);
    return res.status(500).json({ error: "Failed to update settings" });
  }
}