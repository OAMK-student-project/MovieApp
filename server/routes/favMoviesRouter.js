import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { addFavourite, removeFavourite, favouritesByUser } from '../controllers/favMoviesController.js';

const router = Router();

router.get("/",auth, favouritesByUser);
router.post("/", auth,addFavourite);
router.delete("/", auth, removeFavourite);

export default router;