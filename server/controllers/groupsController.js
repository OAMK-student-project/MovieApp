import { getAllGroups, addGroup } from '../models/groupsModel.js'; // your DB functions

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
    const groupData = req.body; // expects { name, created_by }
    const newGroup = await addGroup(groupData);
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add group' });
  }
};