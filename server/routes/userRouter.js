import { Router } from "express";
import { signUp, signIn, test, refresh, signout } from "../controllers/userController.js";
import { auth } from "../helpers/auth.js";

const router = Router();

router.get("/test", auth, test);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refresh);
router.post("/signout", signout);

export default router;