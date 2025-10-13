import React from 'react'
import { useLocation } from "react-router-dom";
import MovieCard from "../components/MovieCard"
import './SearchScreen.css'

export default function SearchScreen() {
    const location = useLocation();
    const results = location.state?.results || [];
  
    return (
      <div className="page">
        <div className="search-results-page">
          <h2 class="home-title">Search results</h2>
          <div className="movie-list">
            {results.length === 0 && <p>No results</p>}

            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
    </div>
  );
}

    
