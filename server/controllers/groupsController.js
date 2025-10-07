/*import { getAllGroups, addGroup } from '../models/groupsModel.js'; // your DB functions

export const getAllGroups = async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};


// adds a new group and its creator as a member
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const created_by = req.user.id; // logged-in user

    // Create group
    const newGroup = await addGroup({ name, created_by });

    // Add creator as a member
    await db.query(
      'INSERT INTO "Group_members" (user_id, group_id, joined_at) VALUES ($1, $2, NOW())',
      [created_by, newGroup.id]
    );

    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add group' });
  }
};*/

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
