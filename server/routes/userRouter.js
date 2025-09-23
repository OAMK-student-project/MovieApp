import { Router } from "express";
import { signUp, signIn, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

export default router;