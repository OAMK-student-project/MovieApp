import React from 'react'
import { useLocation } from "react-router-dom";

export default function SearchScreen() {
    const location = useLocation();
    const results = location.state?.results || [];
  
    return (
  
     <div>
      <h2>Searchresults</h2>
      <div className="results">
        {results.length === 0 && <p>No results</p>}
        {results.map((m) => (
          <div key={m.id}>
            {m.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                alt={m.title}/>
            ) : (
              <div>
                No picture
              </div>
            )}
            <h2>{m.title}</h2>
            <p>
              Released: {m.release_date || "??"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

    
