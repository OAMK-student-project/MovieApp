import { getAllReviews, getReviewsByUserId, getReviewsWithUserByMovieId, addReview, updateReview, deleteReview, getStatsForIds } from "../models/reviewsModel.js";
import { addMovieToDb, removeMovieFromDb } from "./moviesController.js";

const validateInput = (data, validateFields) => {
    const missingFields = [];
    validateFields.forEach(field => {
        const valueToCheck = data?.[field];
        if (valueToCheck === undefined || valueToCheck === null || (typeof valueToCheck === "string" && valueToCheck.trim() === "")) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) return missingFields;
    return;
}

const getReviews = async (req, res ,next) => {
    try {
        const response = await getAllReviews();
        if(!response) return res.status(500).json({error: "Something went wrong"});
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const getReviewsForMovie = async (req, res, next) => {
  try {
    const movie_id = Number(req.params.tmdbId);
    const rows = await getReviewsWithUserByMovieId(movie_id);

    if (rows.length === 0) return res.status(200).json([]);

    const out = rows.map(review => ({
      id: review.id,
      user_id: review.user_id,
      username: `${review.firstname} ${review.lastname}`,
      email: review.email,
      movie_id: review.movie_id,
      rating: review.rating,
      review_text: review.review_text,
      created_at: review.created_at
    }));

    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
};

const getUsersReviews = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const response = await getReviewsByUserId(userID);
    if (!response) return res.status(500).json({ error: "Something went wrong" });
    if (response.length < 1) return res.status(204).end();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const addNewReview = async (req, res, next) => {
  try {
    const missing = validateInput(req.body, ["movieID", "reviewText", "rating"]);
    if (missing) return res.status(400).json({ error: "Missing information", fields: missing });

    const movieId = Number(req.body.movieID);

    const statsMap = await getStatsForIds([movieId]);
    const existingCount = statsMap.get(movieId)?.review_count ?? 0;

    if (existingCount === 0) {
      await addMovieToDb(movieId);
    }

    const data = { ...req.body, userID: req.user.id };
    const created = await addReview(data);
    if (!created) return res.status(500).json({ error: "Something went wrong" });

    return res.status(201).json({ review: created, movieAdded: existingCount === 0 });
  } catch (error) {
    next(error);
  }
};


const updateMovieReview = async (req, res, next) => {
  try {
    const missing = validateInput(req.body, ["rating", "reviewText", "reviewID"]);
    if (missing) return res.status(400).json({ error: "Missing information", fields: missing });

    const { reviewID } = req.body;
    const data = { ...req.body, userID: req.user.id }; // omistajuus tokenista
    const response = await updateReview(reviewID, data);
    if (!response) return res.status(500).json({ error: "Something went wrong" });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteMovieReview = async (req, res, next) => {
  try {
    const missing = validateInput(req.body, ["reviewID", "movieID"]);
    if (missing) return res.status(400).json({ error: "Missing information", fields: missing });

    const userID = req.user.id; // tokenista
    const { reviewID, movieID } = req.body;

    const deleted = await deleteReview(reviewID, userID);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found or not owned by user" });
    }

    const statsMap = await getStatsForIds([Number(movieID)]);
    const remainingCount = statsMap.get(Number(movieID))?.review_count ?? 0;

    if (remainingCount === 0) {
      await removeMovieFromDb(Number(movieID));
    }

    return res.status(200).json({
      deletedReview: deleted,
      movieRemoved: remainingCount === 0
    });
  } catch (error) {
    next(error);
  }
};


export { getReviews, getUsersReviews, getReviewsForMovie, addNewReview, updateMovieReview, deleteMovieReview };