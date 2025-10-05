import { useState } from "react"
import axios from "axios"
import { posterUrl, backdropUrl } from "../helpers/images"
import { useUser } from "../context/useUser.js";
import ReviewsCard from "./ReviewsCard.jsx";
import AddFavoriteBtn from "../components/AddFavoriteBtn.jsx";
import "./movieCard.css"


export default function MovieCard({ movie, onMovieUpdated  }) {
  const [isOpen, setIsOpen] = useState(false)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showReviews, setShowReviews] = useState(false);
  const { user } = useUser();
  const url = import.meta.env.VITE_API_URL;

  async function getMovieDetails(){
    try {
      const response = await axios.get(url+`/api/movie/${movie.id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function toggle() {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    setIsOpen(true)
    if (!details && !loading) {
      try {
        setLoading(true)
        const data = await getMovieDetails()
        setDetails(data)
      } finally {
        setLoading(false)
      }
    }
  }

  const director = details?.credits?.crew?.find((c) => c.job === "Director")
  const cast = (details?.credits?.cast || []).slice(0, 10)
  
  
  function renderStars(avg) {
    const stars = Math.round(avg);
    return (
      <span className="mc-stars">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i}>★</span>
        ))}
        {Array.from({ length: 5 - stars }).map((_, i) => (
          <span key={i}>☆</span>
        ))}
      </span>
    );
  }

  function handleReviews() {
    if (movie.review_count > 0) {
      return (
        <div className="mc-rating">
          {renderStars(movie.avg_rating)}
          <span className="mc-muted"> ({movie.review_count})</span>
          <button onClick={() => setShowReviews(!showReviews)}>Show reviews</button>

          {showReviews && (
            <ReviewsCard
              movie_id={movie.id}
              onClose={() => setShowReviews(false)}
              onStatsChange={(stats) => onMovieUpdated?.(movie.id, stats)}
            />
          )}
        </div>
      );
    } else if (!user) {
      return <div className="mc-review"><div>No reviews</div></div>;
    } else {
      return (
        <div>
          <div>No reviews</div>
          <button onClick={() => setShowReviews(!showReviews)}>Add review</button>
          {showReviews && (
            <ReviewsCard
              movie_id={movie.id}
              onClose={() => setShowReviews(false)}
              onStatsChange={(stats) => onMovieUpdated?.(movie.id, stats)}
            />
          )}
        </div>
      );
    }
  }

  /** mc = moviecard*/
  return (
    <div className="mc-card">
      
      <img
        className="mc-poster"
        src={posterUrl(movie.poster_path)}  
        alt={movie.title}
        loading="lazy"
      />

      <AddFavoriteBtn movie={movie} />

      <div className="mc-body">
        <h3 className="mc-title" title={movie.title}>{movie.title}</h3>
          {handleReviews()}
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