

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
  updateJoinRequest
} from '../controllers/groupJoinController.js';
import { getGroupsByUserId } from '../models/groupsModel.js';
import { auth } from '../helpers/auth.js';

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

// --- Luo uusi ryhmä ---
router.post('/', auth, createGroup);

// --- Liittymispyynnöt ---
router.post('/:id/request-join', auth, requestJoinGroup);
router.get('/:id/requests', auth, getGroupRequests);
router.put('/:id/requests/:requestId', auth, updateJoinRequest);

export default router;