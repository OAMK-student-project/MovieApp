/*import { Router } from "express";
import { signUp, signIn, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";
import users from "../models/usersModel.js";

const router = Router();

// Auth routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

// CRUD routes
router.get("/", async (req, res) => {
  try {
    const result = await users.getAll();
    res.json(result.rows || result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const currentUserId = 1;
    const result = await users.getById(currentUserId);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
/ GET /users/me
router.get("/me", auth, async (req, res) => {
  try {
    const currentUserId = req.userId; // saadaan auth-middlewaresta
    const result = await users.getById(currentUserId);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await users.delete(id);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;*/

import { Router } from "express";
import { signUp, signIn, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";
import users from "../models/usersModel.js";

const router = Router();

// Auth routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

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

/*// Hae kirjautuneen käyttäjän tiedot
router.get("/me", auth, async (req, res) => {
  try {
    const currentUserId = req.userId; // auth-middleware lisää tämän
    const result = await users.getById(currentUserId);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});*/
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

/*// Poista vain oma käyttäjä
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.userId) {
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
});*/
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



export default router;