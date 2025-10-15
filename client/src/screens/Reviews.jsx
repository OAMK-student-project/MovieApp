import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/useUser";
import "./Reviews.css";
import MovieCard from "../components/MovieCard";

function Reviews(){
    const url = import.meta.env.VITE_API_URL + `/api/movies`;
    const [allReviews, setAllReviews] = useState([]);
    const [filter, setFilter] = useState("all");
    const [visible, setVisible] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const fetchReviews = async () => {
    try {
            const { data } = await axios.get(`${url}/allreviewed`);
            setAllReviews(Array.isArray(data) ? data : []);
            setVisible(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyReviewedMovieIds = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/byuser`, {
        validateStatus: () => true
        });
        if (res.status === 401 || !Array.isArray(res.data)) return new Set();
        return new Set(res.data.map(r => Number(r.movie_id)));
    };

    const handleMovieUpdated = (movieId, { review_count, avg_rating }) => {
    setAllReviews(prev =>
            review_count === 0
            ? prev.filter(m => Number(m.id) !== Number(movieId))
            : prev.map(m => Number(m.id) === Number(movieId)
                ? { ...m, review_count, avg_rating }
                : m
                )
        );
    };

   useEffect(() => {
     let active = true;
     const run = async () => {
       if (filter === "all") {
         setVisible(allReviews);
         return;
       }
       if (!user?.identifiedUser) {
         setVisible([]);
         return;
       }
       try {
         const myIds = await fetchMyReviewedMovieIds();
         if (!active) return;
         setVisible(allReviews.filter(m => myIds.has(Number(m.id))));
       } catch (e) {
         console.error(e);
         if (active) {
           setVisible([]);
           toast.error("Failed to fetch your reviews");
         }
       }
     };
     run();
     return () => { active = false; };
   }, [filter, allReviews, user?.identifiedUser]);

    useEffect(() => {
        let active = true;
        (async () => {
        setLoading(true);
        try {
            await fetchReviews();
        } finally {
            if (active) setLoading(false);
        }
        })();
        return () => { active = false; };
    }, [url]);

    return (
    <div id="reviews" className="page">
        <div id="controlArea">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Show all</option>
            <option value="mine">Show mine</option>
        </select>
        </div>
        <div id="reviewsArea" className="movie-list">
        {visible.map((movie) => (
            <MovieCard key={movie.id} movie={movie}  onMovieUpdated={handleMovieUpdated} />
        ))}
        {!loading && visible.length === 0 && (
            <p style={{ gridColumn: "1/-1", opacity: 0.8 }}>
            {filter === "mine" ? "Sign in to see your reviews!" : "No reviews found."}
            </p>
        )}
        </div>
    </div>
    );

}

export default Reviews;