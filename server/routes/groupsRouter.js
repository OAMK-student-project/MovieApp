import express from 'express';
import { fetchAllGroups } from '../controllers/groupsController.js';
import {
  requestJoinGroup,
  getGroupRequests,
  updateJoinRequest
} from '../controllers/groupJoinController.js';

const router = express.Router();

// existing route
router.get('/', fetchAllGroups);

// new routes for join requests
router.post('/:id/request-join', requestJoinGroup);
router.get('/:id/requests', getGroupRequests);
router.put('/:id/requests/:requestId', updateJoinRequest);

export default router;