import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = useParams(); // optional if you pass groupId in URL
  const results = location.state?.results || [];
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleAddMovieToGroup = async (tmdbId) => {
    try {
      await axios.post(
        `${API_URL}/groups/${groupId}/movies`,
        { movie_id: tmdbId },
        { withCredentials: true }
      );

      alert("Movie added to group!");
      navigate(`/grouppage/${groupId}`); // go back to group page
    } catch (err) {
      console.error("Failed to add movie:", err);
      alert("Failed to add movie. Make sure the TMDB ID is correct.");
    }
  };

  if (results.length === 0) return <p>No search results found.</p>;

  return (
    <div>
      <h2>Search Results</h2>
      <div className="grid">
        {results.map((movie) => (
          <div key={movie.id} style={{ position: "relative" }}>
            <MovieCard movie={movie} />
            <button
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                background: "green",
                color: "white",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
              onClick={() => handleAddMovieToGroup(movie.id)}
            >
              Add to Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}