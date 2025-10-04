import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { addFavourite, removeFavourite, favouritesByUser,favouritesByList } from '../controllers/favMoviesController.js';

const router = Router();

router.get("/",auth, favouritesByUser);
router.get("/movies", auth, favouritesByList);
router.post("/", auth, addFavourite);
router.delete("/", auth, removeFavourite);

export default router;