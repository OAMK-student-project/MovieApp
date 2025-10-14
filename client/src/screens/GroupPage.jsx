
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";
import ManageGroupNav from "../components/ManageGroupNav.jsx";
import "./GroupPage.css";
import toast from "react-hot-toast";

  
export default function GroupPage() {
  const { id } = useParams(); // Group ID
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // --- Fetch group info ---
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}`, {
          withCredentials: true,
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
        toast.error("Failed to fetch group");
      } finally {
        setLoadingGroup(false);
      }
    };
    fetchGroup();
  }, [id]);

  // --- Fetch group movies ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}/movies`, {
          withCredentials: true,
        });

        const moviesWithDetails = await Promise.all(
          res.data.map(async (m) => {
            try {
              const movieRes = await axios.get(
                `${API_URL}/api/movies/${m.movie_id}`,
                { withCredentials: true }
              );
              return {
                ...movieRes.data,
                group_movie_id: m.id,
              };
            } catch {
              return { ...m, group_movie_id: m.id };
            }
          })
        );

        setMovies(moviesWithDetails);
      } catch (err) {
        console.error("Error fetching group movies:", err);
        toast.error("Failed to fetch group movies");
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [id]);

  // --- Search movies ---
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/movies?q=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );
      setSearchResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Failed to search movies");
    }
  };

  // --- Add movie to group ---
  const handleAddMovie = async (tmdbId) => {
  try {
    const res = await axios.post(
      `${API_URL}/groups/${id}/movies`,
      { movie_id: tmdbId },
      { withCredentials: true }
    );

    const movieRes = await axios.get(`${API_URL}/api/movies/${tmdbId}`, {
      withCredentials: true,
    });

    setMovies((prev) => [
      ...prev,
      { ...movieRes.data, group_movie_id: res.data.id },
    ]);

    setSearchQuery("");
    setSearchResults([]);
    toast.success("Movie added to group!");
    
  // FIXED: navigate back to the correct URL
    navigate(`/grouppage/${id}`);
  } catch (err) {
    console.error("Error adding movie:", err);
    toast.error("Failed to add movie");
  }
};

  
const handleDeleteMovie = async (groupMovieId) => {
  toast.custom((t) => (
    <div className="toast-overlay">
      <div className={`toast-modal ${t.visible ? "show" : "hide"}`}>
        <p>Are you sure you want to remove this movie?</p>
        <div className="toast-modal-buttons">
          <button
            className="toast-btn cancel-btn"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>

          <button
            className="toast-btn delete-btn"
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}/groups/${id}/movies/${groupMovieId}`, {
                  withCredentials: true,
                });
                setMovies((prev) =>
                  prev.filter((m) => m.group_movie_id !== groupMovieId)
                );
                toast.success("Movie removed from group.");
              } catch (err) {
                console.error("Error deleting movie:", err);
                toast.error("Failed to delete movie.");
              } finally {
                toast.dismiss(t.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ), { duration: Infinity });
};

  if (loadingGroup || loadingMovies) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div className="group-page-container">
      <h2>{group.name}</h2>

      {/* Navigation */}
      <ManageGroupNav groupId={group.id} />
      

      <div className="group-content">
        {/* Left column: movies */}
        <div className="group-movies">
          {/* Search Movies */}
          <div className="search-panel">
            <h3>Search Movies to add</h3>
            <input className="gp-input"
              placeholder="Enter movie title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="gp-button" type="button" onClick={handleSearch}>
              Search
            </button>

            <div className="grid">
              {searchResults.map((movie) => (
                <div key={`search-${movie.id}`} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button className="gp-addButton" onClick={() => handleAddMovie(movie.id)}>Add to {group.name}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Group Movies */}
          <h3>Movies added in {group.name}</h3>
          {movies.length > 0 ? (
            <div className="grid">
              {movies.map((movie) => (
                <div
                  key={`group-${movie.group_movie_id}`}
                  style={{ position: "relative" }}
                >
                  <MovieCard movie={movie} />
                  <button className="gp-deleteButton" onClick={() => handleDeleteMovie(movie.group_movie_id)}>
                    Delete from {group.name}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No movies added to this group yet.</p>
          )}
        </div>

        {/* Right column: showtimes */}
        <div className="showtimes">
          <h3>Showtimes</h3>
          <p>Showtime information will go here.</p>
        </div>
      </div>
    </div>
  );
}
