
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FavoriteListShared.css"

function SharedListPage() {
  const { uuid } = useParams();
  const [list, setList] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSharedList = async () => {
      try {
        const res = await axios.get(`${url}/shared/favourites/${uuid}`);
        setList(res.data.list);
        setMovies(res.data.movies);
      } catch (err) {
        console.error("Error fetching shared list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedList();
  }, [uuid]);

  if (loading) return <p>Loading shared list...</p>;
  if (!list) return <p>Shared list not found.</p>;

return (
  <div className="sharedContainer">
    <h2>{list.name}</h2>
    {movies.length === 0 ? (
      <p>No movies in this list.</p>
    ) : (
      <ul className="sharedUl">
        {movies.map((movie) => (
          <li className="sharedLi" key={movie.id}>
            {movie.movie_title} ({movie.genre.split(",").map(g => g.trim()).join(", ")})
          </li>
        ))}
      </ul>
    )}
  </div>
);
}

export default SharedListPage;
