import { Router } from "express";
import { fetchEvents, fetchTheaters } from "../services/finnkinoService.js"

const router = Router();

router.get("/locations", fetchTheaters);

router.get("/shows", fetchEvents);

export default router;