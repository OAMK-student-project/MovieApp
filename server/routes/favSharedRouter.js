import { Router } from "express";
import { getSharedList } from "../controllers/favListController.js";

const router = Router();

router.get("/favourites/:uuid", getSharedList);

export default router;
