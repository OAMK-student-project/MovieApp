import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useUser } from "../context/useUser.js";
import "./ReviewsCard.css";

function ReviewCard({ movie_id, onClose, onStatsChange }) {
  const url = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(3);
  const { user } = useUser();

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  //const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusDetail, setStatusDetail] = useState("");

  const saving = status === "saving";
  const submitting = status === "submitting";
  const deleting = status === "deleting";
  const loading = status === "loading";

  const myUserId = useMemo(() => Number(user?.id ?? user?.userID), [user]);
  const isOwner = (review) => Number(review.user_id) === myUserId;
  const hasMyReview = useMemo(
    () => reviews.some((r) => isOwner(r)),
    [reviews, myUserId]
  );

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
       setStatus("loading");
       setStatusDetail("Loading reviews…");        
        const { data } = await axios.get(
          `${url}/api/reviews/movie/${movie_id}`,
          { withCredentials: true }
        );
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];
          setReviews(list);
          onStatsChange?.(computeStats(list));
          setStatus("idle"); 
          setStatusDetail("");
        }
      } catch {
        if (!cancelled) {
          setReviews([]);
          onStatsChange?.({ review_count: 0, avg_rating: null });
          setStatus("error");
          setStatusDetail("Failed to load reviews");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [movie_id, url]);

  async function refreshList() {
    setStatus("loading");
    setStatusDetail("Refreshing…");
    const { data } = await axios.get(
      `${url}/api/reviews/movie/${movie_id}`,
      { withCredentials: true }
    );
    const list = Array.isArray(data) ? data : [];
    setReviews(list);
    onStatsChange?.(computeStats(list));
    setStatus("idle");
    setStatusDetail(""); 
  }

  async function postReview() {
    try {
      setStatus("submitting");
      setStatusDetail("Submitting review…");
      await axios.post(
        `${url}/api/reviews/add`,
        {
          movieID: movie_id,
          reviewText: reviewText.trim(),
          rating: Number(rating),
        },
        { withCredentials: true }
      );
      await refreshList();
      setReviewText("");
      setRating(3);
      setAdding(false);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusDetail("Failed to submit review");
      } finally {
        if (status === "submitting") {
            setStatus("idle");
            setStatusDetail("");
      }
    }
}

  async function deleteReview(reviewID, movieID) {
    try {
      setStatus("deleting");
      setStatusDetail("Deleting review…");
      await axios.delete(`${url}/api/reviews/delete`, {
        data: { reviewID, movieID },
        withCredentials: true,
      });
      setReviews((prev) => {
        const next = prev.filter((r) => r.id !== reviewID);
        onStatsChange?.(computeStats(next));
        if (next.length === 0) onClose?.();
        return next;
      });
      setStatus("idle");
      setStatusDetail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusDetail("Failed to delete review");
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
    setStatus("idle");
    setStatusDetail("");
  }

  async function saveEdit(reviewID) {
    try {
      setStatus("saving");
      setStatusDetail("Saving changes…");
      const payload = {
        reviewID,
        reviewText: editText,
        rating: Number(editRating),
      };
      const { data } = await axios.put(
        `${url}/api/reviews/update`,
        payload,
        { withCredentials: true }
      );

      setReviews((prev) => {
        const next = prev.map((r) =>
          r.id === reviewID
            ? {
                ...r,
                review_text: data?.review_text ?? payload.reviewText,
                rating: data?.rating ?? payload.rating,
              }
            : r
        );
        onStatsChange?.(computeStats(next));
        return next;
      });


      setStatus("idle");
      setStatusDetail("");
      cancelEdit();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusDetail("Failed to save changes");
    }
  }

  const renderStatus = () => { 
    if (status === "idle") return null;
    return (
      <div className={`rc-status rc-status--${status}`}>
        {statusDetail || status}
      </div>
    );
  };

  const canAdd =
    Boolean(myUserId) && !hasMyReview;

return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose}>Close</button>
        {renderStatus()}

        {canAdd && !adding && (
          <div className="rc-toolbar">
            <button type="button" onClick={() => setAdding(true)} disabled={loading || submitting || saving || deleting}>Add review</button>
          </div>
        )}

        {canAdd && adding && (
          <div className="rc-form">
            <input type="text" placeholder="What did you think?" value={reviewText} onChange={(e) => setReviewText(e.target.value)} disabled={submitting || loading}/>
            <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} disabled={submitting || loading}/>
            <div className="rc-actions">
              <button type="button" onClick={postReview} disabled={submitting || reviewText.trim() === "" || Number.isNaN(rating) || rating < 1 || rating > 5}>Submit</button>
              <button type="button" onClick={() => { setAdding(false); setReviewText(""); setRating(3); }}>Cancel</button>
            </div>
          </div>
        )}

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
                      <input type="number" min={1} max={5} value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}/>
                      <div className="rc-actions">
                        <button type="button" disabled={saving || editText.trim() === "" || Number.isNaN(editRating) || editRating < 1 || editRating > 5} onClick={() => saveEdit(review.id)}>
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
                          <button type="button" onClick={() => deleteReview(review.id, review.movie_id)} disabled={deleting || saving || submitting || loading} >Delete</button>
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
            <input type="text" placeholder="What did you think?" value={reviewText} onChange={(e) => setReviewText(e.target.value)} disabled={submitting || loading}/>
            <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} disabled={submitting || loading}/>
            <button type="button" onClick={() => postReview()} disabled={submitting || reviewText.trim() === "" || Number.isNaN(rating) || rating < 1 || rating > 5}>{submitting ? "Submitting…" : "Submit"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
