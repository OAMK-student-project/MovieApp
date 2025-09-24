import express from "express";
import { pool } from "../helpers/db.js"; 

const router = express.Router();

// GET /users  fetch all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, firstname, lastname, email FROM "Users";'
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// get user by id 
router.get("/me", async (req, res) => {
  try {
    // For demo, assume current user ID is 1
    const currentUserId = 1;

    const result = await pool.query(
      'SELECT id, firstname, lastname, email FROM "Users" WHERE id = $1',
      [currentUserId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /users/:id  delete user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM "Users" WHERE id = $1 RETURNING *;',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
import { Router } from "express";
import { signUp, signIn, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

export default router;