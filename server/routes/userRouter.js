import express from "express";
import users from "../models/usersModel.js";  // polku sun modeliin
import { Router } from "express";
import { signUp, signIn, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

import express from "express";
//import { pool } from "../helpers/db.js"; 

//const router = express.Router();

// GET /users - fetch all users
router.get("/", (req, res) => {
  users.getAll((err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result.rows);
  });
});

// GET /users/me - get user by ID (esim. hardkoodattu ID = 1)
router.get("/me", (req, res) => {
  const currentUserId = 1;
  users.getById(currentUserId, (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  });
});

// DELETE /users/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  users.delete(id, (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted", user: result.rows[0] });
  });
});

export default router;