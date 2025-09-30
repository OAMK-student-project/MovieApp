import express from "express";
import { getMyGroups } from "../controllers/myGroupsController.js";

const router = express.Router();

// GET /users/:id/groups
router.get("/users/:id/groups", getMyGroups);

export default router;