import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard.jsx";
import "./GroupPage.css";
import toast from "react-hot-toast";

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // --- Fetch group info ---
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}`, { withCredentials: true });
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
        const res = await axios.get(`${API_URL}/groups/${id}/movies`, { withCredentials: true });
        const moviesWithDetails = await Promise.all(
          res.data.map(async (m) => {
            try {
              const movieRes = await axios.get(`${API_URL}/api/movies/${m.movie_id}`, { withCredentials: true });
              return { ...movieRes.data, group_movie_id: m.id, newShowtime: "" };
            } catch {
              return { ...m, group_movie_id: m.id, newShowtime: "" };
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

  // --- Fetch group showtimes ---
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${id}/showtimes`, { withCredentials: true });
        setShowtimes(res.data);
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        toast.error("Failed to fetch showtimes");
      } finally {
        setLoadingShowtimes(false);
      }
    };
    fetchShowtimes();
  }, [id]);

  // --- Search movies ---
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(`${API_URL}/api/movies?q=${encodeURIComponent(searchQuery)}`, { withCredentials: true });
      setSearchResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Failed to search movies");
    }
  };

  // --- Add movie to group ---
  const handleAddMovie = async (tmdbId) => {
    try {
      const res = await axios.post(`${API_URL}/groups/${id}/movies`, { movie_id: tmdbId }, { withCredentials: true });
      const movieRes = await axios.get(`${API_URL}/api/movies/${tmdbId}`, { withCredentials: true });
      setMovies(prev => [...prev, { ...movieRes.data, group_movie_id: res.data.id, newShowtime: "" }]);
      setSearchQuery("");
      setSearchResults([]);
      toast.success("Movie added to group!");
      navigate(`/groups/${id}`);
    } catch (err) {
      console.error("Error adding movie:", err);
      toast.error("Failed to add movie");
    }
  };

  // --- Delete movie ---
  const handleDeleteMovie = async (groupMovieId) => {
    toast.custom(t => (
      <div className={`toast-modal-overlay ${t.visible ? "show" : "hide"}`}>
        <div className="toast-modal">
          <p>Are you sure you want to remove this movie?</p>
          <div className="toast-modal-buttons">
            <button className="toast-btn cancel-btn" onClick={() => toast.dismiss(t.id)}>Cancel</button>
            <button
              className="toast-btn delete-btn"
              onClick={async () => {
                try {
                  await axios.delete(`${API_URL}/groups/${id}/movies/${groupMovieId}`, { withCredentials: true });
                  setMovies(prev => prev.filter(m => m.group_movie_id !== groupMovieId));
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

  // --- Add showtime to database ---
  const handleAddShowtime = async (movie_title, theater_name, show_date) => {
    if (!movie_title || !theater_name || !show_date) return toast.error("Missing required fields");
    try {
      const res = await axios.post(`${API_URL}/groups/${id}/showtimes`, { movie_title, theater_name, show_date }, { withCredentials: true });
      setShowtimes(prev => [...prev, res.data]);
      toast.success("Showtime added!");
    } catch (err) {
      console.error("Error adding showtime:", err);
      toast.error("Failed to add showtime");
    }
  };


const handleDeleteShowtime = (showtimeId) => {
  toast.custom(t => (
    <div className={`toast-modal-overlay ${t.visible ? "show" : "hide"}`}>
      <div className="toast-modal">
        <p>Are you sure you want to delete this showtime?</p>
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
                await axios.delete(
                  `${API_URL}/groups/${id}/showtimes/${showtimeId}`,
                  { withCredentials: true }
                );
                setShowtimes(prev => prev.filter(s => s.id !== showtimeId));
                toast.success("Showtime deleted");
              } catch (err) {
                console.error("Error deleting showtime:", err);
                toast.error("Failed to delete showtime");
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


  if (loadingGroup || loadingMovies || loadingShowtimes) return <p>Loading...</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div className="group-page-container">
      <h2>{group.name}</h2>
     

      <div className="group-content">
        {/* Left column: movies */}
        <div className="group-movies">
          <div className="search-panel">
            <h3>Search Movies to Add</h3>
            <input placeholder="Enter movie title" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <div className="grid">
              {searchResults.map(movie => (
                <div key={`search-${movie.id}`} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button onClick={() => handleAddMovie(movie.id)}>Add</button>
                </div>
              ))}
            </div>
          </div>

          <h3>Group Movies</h3>
          {movies.length === 0 ? <p>No movies added to this group yet.</p> : (
            <div className="grid">
              {movies.map(movie => (
                <div key={`group-${movie.group_movie_id}`} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button onClick={() => handleDeleteMovie(movie.group_movie_id)}>Delete</button>

                  {/* Add showtime input */}
                  <div className="showtime-input">
                    <input
                      type="text"
                      placeholder="Theater name"
                      value={movie.newTheater || ""}
                      onChange={e => setMovies(prev => prev.map(m =>
                        m.group_movie_id === movie.group_movie_id ? { ...m, newTheater: e.target.value } : m
                      ))}
                    />
                    <input
                      type="datetime-local"
                      value={movie.newShowtime || ""}
                      onChange={e => setMovies(prev => prev.map(m =>
                        m.group_movie_id === movie.group_movie_id ? { ...m, newShowtime: e.target.value } : m
                      ))}
                    />
                    <button onClick={() => handleAddShowtime(movie.title, movie.newTheater, movie.newShowtime)}>Add Showtime</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: showtimes */}
        <div className="showtimes">
          <h3>Group Showtimes</h3>
          {showtimes.length === 0 ? <p>No showtimes yet.</p> : (
            showtimes.map(s => (
              <div key={s.id} className="showtime-card">
                <strong>{s.movie_title}</strong> at {s.theater_name} on {new Date(s.show_date).toLocaleString()}
                <button onClick={() => handleDeleteShowtime(s.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
