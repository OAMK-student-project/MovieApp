import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favMoviesController.js';

const router = Router();

router.get("/",getFavourites);
router.post("/", auth,addFavourite);
router.delete("/removeFacourite/:id", removeFavourite);

export default router;