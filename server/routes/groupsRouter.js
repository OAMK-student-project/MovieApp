

/*import express from 'express';
import { fetchAllGroups, createGroup } from '../controllers/groupsController.js';
import {
  requestJoinGroup,
  getGroupRequests,
  updateJoinRequest
} from '../controllers/groupJoinController.js';
import { getGroupsByUserId } from '../models/groupsModel.js';
import { auth } from '../helpers/auth.js';

const router = express.Router();

// fetch all groups
router.get('/', fetchAllGroups);

// fetch groups of logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await getGroupsByUserId(userId);
    res.json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// create new group
router.post('/', createGroup);

// join requests routes
router.post('/:id/request-join', requestJoinGroup);
router.get('/:id/requests', getGroupRequests);
router.put('/:id/requests/:requestId', updateJoinRequest);

export default router;*/

import express from 'express';
import { fetchAllGroups, createGroup } from '../controllers/groupsController.js';
import {
  requestJoinGroup,
  getGroupRequests,
  updateJoinRequest,
  getGroupOwner,
  leaveGroup,
  deleteGroup
} from '../controllers/groupJoinController.js';
import { getGroupsByUserId } from '../models/groupsModel.js';
import { auth } from '../helpers/auth.js';
import db from '../helpers/db.js';
const router = express.Router();

// --- Kaikki ryhmät ---
router.get('/', fetchAllGroups);

// --- Kirjautuneen käyttäjän ryhmät ---
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await getGroupsByUserId(userId);
    res.json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Database error" });
  }
});
// --- Get a single group by ID ---
router.get('/:id', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const result = await db.query('SELECT * FROM "Groups" WHERE id = $1', [groupId]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Group not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching group:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// --- Luo uusi ryhmä ---
router.post('/', auth, createGroup);

// --- Liittymispyynnöt ---
router.get('/:id/owner', auth, getGroupOwner); // Ownerin ID
router.post('/:id/request-join', auth, requestJoinGroup);
router.get('/:id/requests', auth, getGroupRequests);
router.put('/:id/requests/:requestId', auth, updateJoinRequest);

// poistu ryhmästä kukatahansa jäsen 
router.delete('/:id/leave', auth, leaveGroup);

// --- Poista ryhmä vain owner voi poistaa ---
router.delete('/:id', auth, deleteGroup);

export default router;