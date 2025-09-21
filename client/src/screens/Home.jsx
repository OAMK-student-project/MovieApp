import React, { useEffect, useRef, useState } from "react"
import { getTrendingToday } from "../services/movieService"
import MovieCard from "../components/MovieCard.jsx"
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("idle");  
  const [hasMore, setHasMore] = useState(true);
  const [err, setErr] = useState("");


  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        const data = await getTrendingToday(page);
        if (cancelled) return;

        const results = data?.results ?? [];
        setMovies(prev => [...prev, ...results]);
        setHasMore(page < (data?.total_pages ?? page));
        setStatus("idle");
      } catch (e) {
        if (cancelled) return;
        setErr(e?.message || "Unknown error");
        setStatus("error");
      }
    })
    ();

    return () => { cancelled = true; };
  }, [page]); 

  const loaderRef = useRef(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && status !== "loading") {
        setPage(p => p + 1);
      }
    });

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, status]); 

  return (
    <main className="page">
      <h1 className="home-title">Trending right now</h1>

      {status === "error" && (
        <p className="status error">Failed to load movies: {err}</p>
      )}

      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      <div ref={loaderRef} className="infinite-loader" />

      {status === "loading" && <p className="status">Loading more…</p>}
      {!hasMore && movies.length > 0 && (
        <p className="status">No more movies</p>
      )}
    </main>
  );
}