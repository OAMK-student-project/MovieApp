
// controllers/groupsController.js
import { getAllGroups, addGroup } from '../models/groupsModel.js';
import db from '../helpers/db.js';

export const fetchAllGroups = async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const created_by = req.user.id;

    const newGroup = await addGroup({ name, created_by });

    // Add creator to Group_members with Owner role
    await db.query(
      'INSERT INTO "Group_members" (user_id, group_id, role, joined_at) VALUES ($1, $2, $3, NOW())',
      [created_by, newGroup.id, 'Owner']
    );

    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add group' });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if user is owner
    const ownerCheck = await db.query(
      `SELECT role FROM "Group_members" WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (!ownerCheck.rows.length) {
      return res.status(404).json({ message: "You are not a member of this group" });
    }

    const role = ownerCheck.rows[0].role;

    if (role === "Owner") {
      return res.status(403).json({ message: "Owner cannot leave the group. Delete the group instead." });
    }

    // Remove member
    await db.query(
      `DELETE FROM "Group_members" WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    res.json({ message: "You have left the group" });
  } catch (err) {
    console.error("Error leaving group:", err);
    res.status(500).json({ message: "Failed to leave group" });
  }
};