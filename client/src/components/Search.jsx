
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function Search() {

  const [titleQuery, setTitleQuery] = useState("");
  const [directorQuery, setDirectorQuery] = useState("");
  const [genre, setGenre] = useState("28"); // Action oletuksena
  const navigate = useNavigate();

  // Yleinen funktio, joka hoitaa haun ja navigoinnin
  const fetchAndNavigate = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results || [];
      navigate("/search", { state: { results } });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // hakufunktiot
  const searchByTitle = () => {
    fetchAndNavigate(`http://localhost:3001/api/movies?q=${encodeURIComponent(titleQuery)}`);
  };

  const searchByDirector = () => {
    fetchAndNavigate(`http://localhost:3001/api/movies?director=${encodeURIComponent(directorQuery)}`);
  };

  const searchByGenre = () => {
    fetchAndNavigate(`http://localhost:3001/api/movies?genre=${encodeURIComponent(genre)}`);
  };

  const getPopular = () => {
    fetchAndNavigate(`http://localhost:3001/api/movies`);
  };

  return (
    <div className="searchContainer">
      <h3>Search movies</h3>

      {/* Hakusana */}
      <input
        placeholder="Search by title..."
        value={titleQuery}
        onChange={(e) => setTitleQuery(e.target.value)}
      />
      <button type="button" onClick={searchByTitle}>
        Search
      </button>

      {/* Ohjaajahaku */}
      <input
        placeholder="Search by director..."
        value={directorQuery}
        onChange={(e) => setDirectorQuery(e.target.value)}
      />
      <button type="button" onClick={searchByDirector}>
        Search by Director
      </button>

      {/* Genrehaku */}
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="28">Action</option>
        <option value="35">Comedy</option>
        <option value="18">Drama</option>
        <option value="27">Horror</option>
      </select>
      <button type="button" onClick={searchByGenre}>
        Search by Genre
      </button>

      {/* Suositut */}
      <button type="button" onClick={getPopular}>
        Popular
      </button>
    </div>
  );
}