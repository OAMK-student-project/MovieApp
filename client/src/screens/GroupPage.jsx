

/*import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";
import "./GroupPage.css";

export default function GroupPage() {
  const { id } = useParams(); // Group ID
  const [group, setGroup] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState(null);
  const [newMovieId, setNewMovieId] = useState(""); // TMDB ID input
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // Fetch group info
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}`, {
          withCredentials: true,
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to fetch group");
      } finally {
        setLoadingGroup(false);
      }
    };
    fetchGroup();
  }, [id]);

  // Fetch group movies with details from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}/movies`, {
          withCredentials: true,
        });

        // Map over each movie to fetch TMDB details
        const moviesWithDetails = await Promise.all(
          res.data.map(async (m) => {
            try {
              const movieRes = await axios.get(`${API_URL}/api/movies/${m.movie_id}`, {
                withCredentials: true,
              });
              return { ...m, ...movieRes.data };
            } catch {
              return m; // fallback if TMDB fetch fails
            }
          })
        );

        setMovies(moviesWithDetails);
      } catch (err) {
        console.error("Error fetching group movies:", err);
        setError("Failed to fetch group movies");
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [id]);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovieId) return;

    try {
      const res = await axios.post(
        `${API_URL}/groups/${id}/movies`,
        { movie_id: Number(newMovieId) },
        { withCredentials: true }
      );

      // Fetch movie details for the new movie
      const movieRes = await axios.get(`${API_URL}/api/movies/${res.data.movie_id}`, {
        withCredentials: true,
      });

      setMovies((prev) => [...prev, { ...res.data, ...movieRes.data }]);
      setNewMovieId(""); // clear input
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Failed to add movie. Make sure the TMDB ID is correct.");
    }
  };

  const handleDeleteMovie = async (groupMovieId) => {
    if (!window.confirm("Are you sure you want to remove this movie?")) return;

    try {
      await axios.delete(`${API_URL}/groups/movies/${groupMovieId}`, {
        withCredentials: true,
      });
      setMovies((prev) => prev.filter((m) => m.id !== groupMovieId));
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Failed to delete movie.");
    }
  };

  if (loadingGroup || loadingMovies) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div className="group-page">
      <h2>{group.name}</h2>
      <Link to={`/managegroup/${group.id}`}>
        <h4>Go to Manage Group</h4>
      </Link>

      <h3>Add a Movie to Group</h3>
      <form onSubmit={handleAddMovie} style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Enter TMDB Movie ID"
          value={newMovieId}
          onChange={(e) => setNewMovieId(e.target.value)}
          required
        />
        <button type="submit">Add Movie</button>
      </form>

      <h3>Group Movies</h3>
      {movies.length > 0 ? (
        <div className="grid">
          {movies.map((movie) => (
            <div key={movie.id} style={{ position: "relative" }}>
              <MovieCard movie={movie} />
              <button
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteMovie(movie.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies added to this group yet.</p>
      )}
    </div>
  );
}*/

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";
import "./GroupPage.css";

export default function GroupPage() {
  const { id } = useParams(); // Group ID
  const [group, setGroup] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // Fetch group info
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}`, {
          withCredentials: true,
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to fetch group");
      } finally {
        setLoadingGroup(false);
      }
    };
    fetchGroup();
  }, [id]);

  // Fetch group movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}/movies`, {
          withCredentials: true,
        });
        // Fetch TMDB details for each movie
        const moviesWithDetails = await Promise.all(
          res.data.map(async (m) => {
            try {
              const movieRes = await axios.get(`${API_URL}/api/movies/${m.movie_id}`, {
                withCredentials: true,
              });
              return { ...m, ...movieRes.data };
            } catch {
              return m;
            }
          })
        );
        setMovies(moviesWithDetails);
      } catch (err) {
        console.error("Error fetching group movies:", err);
        setError("Failed to fetch group movies");
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [id]);

  // Search movies by title
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(`${API_URL}/api/movies?q=${encodeURIComponent(searchQuery)}`, {
        withCredentials: true,
      });
      setSearchResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to search movies");
    }
  };

  // Add movie to group
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

      setMovies((prev) => [...prev, { ...res.data, ...movieRes.data }]);
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Failed to add movie");
    }
  };

  const handleDeleteMovie = async (groupMovieId) => {
    if (!window.confirm("Are you sure you want to remove this movie?")) return;
    try {
      await axios.delete(`${API_URL}/groups/${id}/movies/${groupMovieId}`, {
        withCredentials: true,
      });
      setMovies((prev) => prev.filter((m) => m.id !== groupMovieId));
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Failed to delete movie.");
    }
  };

  if (loadingGroup || loadingMovies) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div className="group-page">
      <h2>{group.name}</h2>
      <Link to={`/managegroup/${group.id}`}>
        <h4>Go to Manage Group</h4>
      </Link>

      <div style={{ marginBottom: "20px" }}>
        <h3>Search Movies to Add</h3>
        <input
          placeholder="Enter movie title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>Search</button>

        <div className="grid">
          {searchResults.map((movie) => (
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
                onClick={() => handleAddMovie(movie.id)}
              >
                Add to Group
              </button>
            </div>
          ))}
        </div>
      </div>

      <h3>Group Movies</h3>
      {movies.length > 0 ? (
        <div className="grid">
          {movies.map((movie) => (
            <div key={movie.id} style={{ position: "relative" }}>
              <MovieCard movie={movie} />
              <button
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteMovie(movie.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies added to this group yet.</p>
      )}
    </div>
  );
}
