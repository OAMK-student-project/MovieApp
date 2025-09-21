import { auth } from '../helpers/auth.js';
import { Router } from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favMoviesController.js';

const router = Router();

router.get("/",getFavourites);
router.post('/create',auth,addFavourite);
router.delete(`/delete/:id`, removeFavourite);

export default router;