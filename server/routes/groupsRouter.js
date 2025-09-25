import express from 'express';
import { fetchAllGroups } from '../controllers/groupsController.js';

const router = express.Router();

router.get('/', fetchAllGroups);

export default router;