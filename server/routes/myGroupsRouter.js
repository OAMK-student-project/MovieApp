import express from "express";
import { getMyGroups } from "../controllers/myGroupsController.js";
import { auth } from "../helpers/auth.js"
const router = express.Router();

// GET /users/:id/groups
router.get("/users/:id/groups",auth, getMyGroups);

export default router;