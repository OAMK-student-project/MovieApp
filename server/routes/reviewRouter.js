import { Router } from "express";
import { getReviews, getUsersReviews, getReviewsForMovie, addNewReview, updateMovieReview, deleteMovieReview } from "../controllers/reviewController.js"
import { auth } from "../helpers/auth.js"
const router = Router();

router.get("/all", getReviews);
router.get("/byuser", auth, getUsersReviews);
router.get("/movie/:tmdbId", getReviewsForMovie);
router.post("/add", auth, addNewReview);
router.put("/update", auth, updateMovieReview);
router.delete("/delete", auth, deleteMovieReview);

export default router;  