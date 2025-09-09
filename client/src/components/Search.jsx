import React from 'react'
import { Suspense, useState } from 'react';
import { useEffect } from "react";
import './Search.css';
import { useNavigate } from "react-router-dom";

export default function Search() {
    const API_KEY = "2834c2f4722abf683f4429eadbe4b5a4"; // Api key 
    const BASE_URL = "https://api.themoviedb.org/3";
    
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState("28"); // Action oletuksena
    const [mode, setMode] = useState("popular"); // popular, search, genre
   
    useEffect(() => {
    fetchMovies();
  }, [mode, genre]);

  const fetchMovies = async () => {
    let url = "";
  
    if (mode === "popular") {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fi-FI`;
    } else if (mode === "search" && query) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=fi-FI`;
    } else if (mode === "genre") {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=fi-FI`;
    }

    if (url) {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    }
  };

  const handleSearch  = async (e) => {
  e.preventDefault();
  setMode("search");
  let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=fi-FI`;
  const res = await fetch(url);
  const data = await res.json();
  setMovies(data.results || []);
  navigate("/search", { state: { results: data.results || [] } });
  };

const handlePopular  = async (e) => {
  e.preventDefault();
  setMode("popular");
  let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fi-FI`;
  const res = await fetch(url);
  const data = await res.json();
  setMovies(data.results || []);
  navigate("/search", { state: { results: data.results || [] } });
  };

const handleGenre = async () => {
  setMode("genre");
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=fi-FI`;
  const res = await fetch(url);
  const data = await res.json();
  setMovies(data.results || []);
  navigate("/search", { state: { results: data.results || [] } });
};


  return (
    <div className="searchContainer">
      <h2> Search movies</h2>

      {/* Hakulomake */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Search movies..."
          onChange={(e) => setQuery(e.target.value)}/>
        <button type="submit">
          Search 
        </button>
      </form>

      {/* Painikkeet eri hakutiloihin */}
      <div>
        <button type="button" onClick={handlePopular}>
          Popular
        </button>
        <button  type="button" onClick={handleGenre}>
          Select genre
        </button>

        
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}>
            <option value="28">Action</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
          </select>
        
      </div>

      </div>
    
  );
}



  