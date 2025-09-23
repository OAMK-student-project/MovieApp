import { useState } from "react"
import { getMovieDetails } from "../services/movieService"
import { posterUrl, backdropUrl } from "../helpers/images"
import { addToFavourites } from "../helpers/favouriteHelper.js"
import "./movieCard.css"

//FontAwesome Imports
//npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons'

export default function MovieCard({ movie, isFavorited }) {
  const [isOpen, setIsOpen] = useState(false)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    setIsOpen(true)
    if (!details && !loading) {
      try {
        setLoading(true)
        const data = await getMovieDetails(movie.id)
        setDetails(data)
      } finally {
        setLoading(false)
      }
    }
  }

  const director = details?.credits?.crew?.find((c) => c.job === "Director")
  const cast = (details?.credits?.cast || []).slice(0, 10)
  

  /** mc = moviecard*/
  return (
    <div className="mc-card">
      
      <img
        className="mc-poster"
        src={posterUrl(movie.poster_path)}  
        alt={movie.title}
        loading="lazy"
      />

      <FontAwesomeIcon icon={isFavorited ? faBookmarkSolid : faBookmarkRegular} size="lg" className="mc-fav-icon" role="button" onClick={() => (addToFavourites(movie), handleFavourite(movie))}/>

      <div className="mc-body">
        <h3 className="mc-title" title={movie.title}>{movie.title}</h3>
        <p className="mc-year">{movie.release_date?.slice(0, 4) || "-"}</p>
        <p className="mc-overview">{movie.overview || "No description."}</p>

        {!isOpen ? (
          <button className="mc-btn" onClick={toggle}>Read more</button>
        ) : (
          <div className="mc-expand">
            {loading && <p>Loading details...</p>}

            {!loading && details && (
              <>
                {details.backdrop_path && (
                  <div
                    className="mc-hero"
                    style={{ backgroundImage: `url(${backdropUrl(details.backdrop_path)})` }}
                  />
                )}

                <div className="mc-meta">
                  <p className="mc-sub">
                    {(details.release_date || "-").slice(0, 4)} • {details.runtime ? `${details.runtime} min` : "-"}
                  </p>
                  <p className="mc-genres">
                    {(details.genres || []).map((g) => g.name).join(" • ")}
                  </p>
                  {director && <p><strong>Director:</strong> {director.name}</p>}
                  
                </div>

                <div className="mc-cast">
                  <h4>Cast</h4>
                  <ul>
                    {cast.map((p) => (
                      <li key={p.cast_id || `${p.id}-${p.credit_id}`}>
                        <span>{p.name}</span>
                        {p.character ? <span className="mc-muted"> as {p.character}</span> : null}
                      </li>
                    ))}
                    {cast.length === 0 && <li className="mc-muted">No cast data.</li>}
                  </ul>
                </div>
              </>
            )}

            <button className="mc-btn mc-btn-secondary" onClick={toggle}>Read less</button>
          </div>
        )}
      </div>
    </div>
  )
}