

import { Router } from "express";
import { signUp, signIn, refresh, signout} from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";
import users from "../models/usersModel.js";
import {deleteProfile } from "../controllers/deleteController.js"
const router = Router();

// Auth routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

// Delete user routes
router.delete("/me", auth, deleteProfile);
// CRUD routes

// Hae kaikki käyttäjät (vain adminille voisi sallia)
router.get("/", async (req, res) => {
  try {
    const result = await users.getAll();
    res.json(result.rows || result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// Hae kirjautuneen käyttäjän tiedot

router.get("/me", auth, async (req, res) => {
  try {
    const currentUserId = req.user.id; // <-- from auth middleware
    const result = await users.getById(currentUserId);

    // result.rows[0] contains the user
    if (!result?.rows?.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]); // <-- return actual user object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Poista vain oma käyttäjä

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.user.id) {  // <-- change here
    return res.status(403).json({ error: "You can only delete your own account" });
  }

  try {
    const result = await users.delete(id);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }



});

// Hae kaikki ryhmät, joissa kirjautunut käyttäjä on jäsen
router.get("/me/groups", auth, async (req, res) => {
  try {
    const query = `
      SELECT g.id, g.name, g.created_at
      FROM "Groups" g
      JOIN "GroupMembers" gm ON gm.group_id = g.id
      WHERE gm.user_id = $1
    `;
    const result = await users.db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;