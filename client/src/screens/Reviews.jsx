import { useState, useEffect } from "react";
import axios from "axios";
import { posterUrl, backdropUrl } from "../helpers/images"
import "./Reviews.css";
import MovieCard from "../components/MovieCard";

function Reviews(){
    const url = import.meta.env.VITE_API_URL + `/api/movies`;
    const [allReviews, setAllReviews] = useState([]);
    const [status, setStatus] = useState("idle"); 

    const fetchReviews = async () => {
    try {
        const { data } = await axios.get(`${url}/allreviewed`);
        setAllReviews(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error(error);
    }
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

    useEffect(()=>{
        fetchReviews();
    },[]);

    return (
    <div id="reviews" className="page">
        <div id="controlArea">
        <select>
            <option value="all">Show all</option>
            <option value="users">Show mine</option>
        </select>
        </div>
        <div id="reviewsArea" className="grid">
        {allReviews.map((movie) => (
            <MovieCard key={movie.id} movie={movie}  onMovieUpdated={handleMovieUpdated} />
        ))}
        </div>
    </div>
    );

}

export default Reviews;