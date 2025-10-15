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
  const [isOwner, setIsOwner] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("#908888ff");
  const [emojiDraft, setEmojiDraft] = useState("👽");
  const [ui, setUi] = useState({ theme_color: "#908888ff", emoji: "👽", note: ""})
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

  // --- Group customize settings ---
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await axios.get(`${API_URL}/groups/${id}/customize`, {
        withCredentials: true,
        signal: controller.signal,
      });
      setUi({
        theme_color: res.data?.theme_color || "#b3b3b3",
        emoji:       res.data?.emoji       || "👽",
        note:        res.data?.note        || "",
      });
    } catch (e) {
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load group settings";
      toast.error(msg);
      console.error(e);
    }
  })();

  return () => controller.abort();
}, [id, API_URL]);

// --- Ryhmän ownerin tarkistus ---
useEffect(() => {
  (async () => {
    try {
      const [ownerRes, meRes] = await Promise.all([
        axios.get(`${API_URL}/groups/${id}/owner`, { withCredentials: true }),
        axios.get(`${API_URL}/user/me`,            { withCredentials: true }),
      ]);
      setIsOwner(ownerRes.data?.ownerId === meRes.data?.id);
    } catch (_e) {
      
      setIsOwner(false);
    }
  })();
}, [id, API_URL]);

// --- Note ---
useEffect(() => {
  setNoteDraft(ui.note || "");
}, [ui.note]);

async function saveNote() {
  try {
    const res = await axios.put(
      `${API_URL}/groups/${id}/customize`,
      { note: noteDraft },
      { withCredentials: true }
    );
    setEditingNote(false);
    setUi(prev => ({ ...prev, note: res.data?.note ?? noteDraft }));
    toast.success("Note saved");
  } catch (e) {
    const msg =
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      (e?.response?.status === 403
        ? "Only owner can update the note"
        : "Failed to save note");
    toast.error(msg);
  }
}
// --- väri ---
async function saveColor() {
  try {
    const res = await axios.put(
      `${API_URL}/groups/${id}/customize`,
      { theme_color: colorDraft },
      { withCredentials: true }
    );
    setUi(prev => ({ ...prev, theme_color: res.data?.theme_color ?? colorDraft }));
    toast.success("Theme color saved");
  } catch (e) {
    const msg =
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      (e?.response?.status === 403
        ? "Only owner can update the color"
        : "Failed to save color");
    toast.error(msg);
  }
}

// --- emoji ---
async function saveEmoji() {
  try {
    // Perusvalidointi: yksi emoji/merkki riittää tähän
    if (!emojiDraft?.trim()) return toast.error("Emoji cannot be empty");
    const res = await axios.put(
      `${API_URL}/groups/${id}/customize`,
      { emoji: emojiDraft },
      { withCredentials: true }
    );
    setUi(prev => ({ ...prev, emoji: res.data?.emoji ?? emojiDraft }));
    toast.success("Emoji saved");
  } catch (e) {
    const msg =
      e?.response?.data?.error ||
      e?.response?.data?.message ||
      (e?.response?.status === 403
        ? "Only owner can update the emoji"
        : "Failed to save emoji");
    toast.error(msg);
  }
}
useEffect(() => {
  setColorDraft(ui.theme_color || "#34d960");
  setEmojiDraft(ui.emoji || "👽");
}, [ui.theme_color, ui.emoji]);

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
      <div className={`toast-overlay ${t.visible ? "show" : "hide"}`}>
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
    <div className="group-page-container"
      style={{ "--group-color": ui.theme_color }}>
      <header className="group-hero">
        <div className="hero-emoji" aria-hidden="true">{ui.emoji}</div>
        <div className="hero-text">
          <h2 className="hero-title">{group.name}</h2>
          {!editingNote && ui.note && <p className="hero-note">{ui.note}</p>}

          {isOwner && (
  <div className="hero-customize">
    {/* Emoji editori */}
    <div className="emoji-row">
      <label htmlFor="emoji-input" className="label">Group emoji</label>
      <div className="emoji-edit">
        <input
          id="emoji-input"
          className="emoji-input"
          type="text"
          maxLength={4}
          value={emojiDraft}
          onChange={(e) => setEmojiDraft(e.target.value)}
          placeholder="🙂"
        />
        <button
          className="btn-save-emoji"
          onClick={saveEmoji}
          disabled={emojiDraft === ui.emoji}
        >
          Save Emoji
        </button>
      </div>
    </div>

    {/* Väri editori */}
    <div className="color-row">
      <label htmlFor="color-input" className="label">Theme color</label>
      <div className="color-edit">
        <input
          id="color-input"
          className="color-input"
          type="color"
          value={colorDraft}
          onChange={(e) => setColorDraft(e.target.value)}
          aria-label="Pick theme color"
        />
        <div className="color-swatches">
          {["#34d960","#ff4757","#ffa502","#5352ed","#2ed573","#1e90ff","#ff7f50"].map(c => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${colorDraft === c ? "active" : ""}`}
              onClick={() => setColorDraft(c)}
              aria-label={`Use ${c}`}
              style={{ backgroundColor: c }} 
            />
          ))}
        </div>
        <button
          className="btn-save-color"
          onClick={saveColor}
          disabled={colorDraft === ui.theme_color}
        >
          Save Color
        </button>
      </div>
    </div>
  </div>
)}
        {isOwner && !editingNote && (
          <button className="btn-noteEditor" onClick={() => setEditingNote(true)}>
            {ui.note ? "Edit note" : "Add note"}
          </button>
        )}
        {isOwner && editingNote && (
          <div className="note-editor">
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Write a short note for the group..."
              rows={3}
            />
            <div className="note-actions">
              <button className="btn-save-note" onClick={saveNote} disabled={noteDraft === ui.note}>
                Save
              </button>
              <button
                className="btn-cancel"
                onClick={() => { setEditingNote(false); setNoteDraft(ui.note || ""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </header>

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
                  <button className="gp-addButton" onClick={() => handleAddMovie(movie.id)}>Add to {group.name}</button>
                </div>
              ))}
            </div>
          </div>

          <h3>Movies added in {group.name}</h3>
          {movies.length === 0 ? <p>No movies added to this group yet.</p> : (
            <div className="movie-list">
              {movies.map(movie => (
                <div key={`group-${movie.group_movie_id}`} style={{ position: "relative" }}>
                  <MovieCard movie={movie} />
                  <button className="gp-deleteButton" onClick={() => handleDeleteMovie(movie.group_movie_id)}>Delete</button>

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