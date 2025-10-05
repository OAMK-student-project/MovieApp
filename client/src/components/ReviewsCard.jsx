import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/useUser.js";
import "./ReviewsCard.css";

function ReviewCard({ movie_id, onClose, onStatsChange }) {
  const url = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(-1);
  const { user } = useUser();

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [saving, setSaving] = useState(false);

  const computeStats = (array) => {
    const n = Array.isArray(array) ? array.length : 0;
    if (n === 0) return { review_count: 0, avg_rating: null };
    const avg = array.reduce((s, r) => s + Number(r.rating || 0), 0) / n;
    return { review_count: n, avg_rating: Math.round(avg * 100) / 100 };
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${url}/api/reviews/movie/${movie_id}`, { withCredentials: true });
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];
          setReviews(list);
          onStatsChange?.(computeStats(list));
        }
      } catch (err) {
        if (!cancelled) {
          setReviews([]);
          onStatsChange?.({ review_count: 0, avg_rating: null });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [movie_id, url]);

  async function postReview() {
    try {
      await axios.post(`${url}/api/reviews/add`, {
        movieID: movie_id,
        reviewText,
        rating: Number(rating),
      });
      const { data } = await axios.get(`${url}/api/reviews/movie/${movie_id}`, { withCredentials: true });
      const list = Array.isArray(data) ? data : [];
      setReviews(list);
      onStatsChange?.(computeStats(list));
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  }

    async function deleteReview(reviewID, movieID) {
      try {
        await axios.delete(`${url}/api/reviews/delete`, { data: { reviewID, movieID } });
        setReviews((prev) => {
          const next = prev.filter(r => r.id !== reviewID);
          onStatsChange?.(computeStats(next));
          if (next.length === 0) onClose?.();
          return next;
        });
      } catch (error) {
        console.error(error);
      }
    }

  function startEdit(review) {
    setEditingId(review.id);
    setEditText(review.review_text ?? "");
    setEditRating(Number(review.rating ?? 0));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
    setEditRating(0);
    setSaving(false);
  }

  async function saveEdit(reviewID) {
    try {
      setSaving(true);
      const payload = {
        reviewID,
        reviewText: editText,
        rating: Number(editRating),
      };
      const { data } = await axios.put(`${url}/api/reviews/update`, payload);

      setReviews((prev) => {
        const next = prev.map((r) =>
          r.id === reviewID
            ? { ...r, review_text: data?.review_text ?? payload.reviewText, rating: data?.rating ?? payload.rating }
            : r
        );
        onStatsChange?.(computeStats(next));
        return next;
      });

      cancelEdit();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }

  const isOwner = (review) =>
    Number(review.user_id) === Number(user?.id ?? user?.userID);

return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose}>
          Close
        </button>

        {reviews.length > 0 ? (
          <div className="rc-list">
            {reviews.map((review) => (
              <div key={review.id} className="rc-item">
                <strong>
                  {(review.email ??
                    `${review.firstname ?? ""} ${review.lastname ?? ""}`).trim()}
                </strong>{" "}
                – {review.rating}/5
                <div>
                  {editingId === review.id ? (
                    <>
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3}/>
                      <input type="number"min={1} max={5} value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}/>
                      <div className="rc-actions">
                        <button type="button" disabled={saving || editText.trim() === "" || Number.isNaN(editRating)} onClick={() => saveEdit(review.id)}>
                          {saving ? "Saving..." : "Save"}</button>
                        <button type="button" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>{review.review_text}</div>
                      {isOwner(review) ? (
                        <div className="rc-actions">
                          <button type="button" onClick={() => startEdit(review)}>Edit</button>
                          <button type="button"onClick={() => deleteReview(review.id, review.movie_id)}>Delete</button>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
                <small>{new Date(review.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="rc-form">
            <input type="text" placeholder="What did you think?" value={reviewText} onChange={(e) => setReviewText(e.target.value)}/>
            <input type="number" min={0} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))}/>
            <button type="button" onClick={() => postReview()} disabled={!reviewText || Number.isNaN(rating)}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
