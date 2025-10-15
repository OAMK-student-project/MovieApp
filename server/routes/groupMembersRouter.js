import express from "express";
import { auth } from "../helpers/auth.js";
import {
  listMembers,
  removeMember,
} from "../controllers/groupMembersController.js";

const router = express.Router({ mergeParams: true });

router.use((req,_res, next) => {
    console.log("members route hit:", req.method, req.originalUrl, req.params)
    next()
});

router.options("/",(_req, res) => res.sendStatus(204))
router.options("/:userId", (_req, res) => res.sendStatus(204))

router.get("/", auth, listMembers);

router.delete("/:userId", auth, removeMember);

export default router;