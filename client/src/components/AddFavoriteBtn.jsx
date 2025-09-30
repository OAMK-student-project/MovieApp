// FontAwesome Imports
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

import UserContext from "../context/UserContext";
import { addFavorites, getLists, favouritesByUser } from "../helpers/favoriteHelper.js";
import "./AddFavoriteBtn.css";

export default function AddFavoriteBtn({ movie }) {
  const { user, accessToken } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

// Check if movie is already favorited
useEffect(() => {
  const checkIfFavorited = async () => {
    if (!user || !accessToken) return;

    try {
      const favourites = await favouritesByUser(accessToken);
      //DEBUG console.log("Fetched favourites (frontend):", favourites);

      const isInFavourites = favourites.some(
        f => String(f.movie_id) === String(movie.id)
      );

      setIsFavorited(isInFavourites);
    } catch (err) {
      console.error("Error checking favourites:", err);
    }
  };

  checkIfFavorited();
}, [user, accessToken, movie.id]);



// Open modal and fetch lists
  const handleClick = async () => {
    setShowModal(true);

    if (favoriteLists.length === 0 && user && accessToken) {
      setLoadingLists(true);
      try {
        const lists = await getLists(user.userID, accessToken);
        setFavoriteLists(lists || []);
      } catch (err) {
        console.error("Error fetching lists:", err);
      } finally {
        setLoadingLists(false);
      }
    }
  };

// Add movie to selected favorite list
    const handleFavourite = async (listId) => {
    if (!user || !accessToken) return;

    try {

        const genreString = movie.genres
        ? movie.genres.map(g => (typeof g === "object" ? g.name : g)).join(", ")
        : movie.genre_ids
        ? movie.genre_ids.join(", ")
        : "Unknown";

        
        const favouriteMovieData = {
            movie_id: movie.id,
            genre: genreString,
            favourite_id: listId,
            movie_title: movie.title,
        };

        await addFavorites(favouriteMovieData, accessToken);

        setIsFavorited(true);
        setShowModal(false);
    } catch (err) {
        console.error("Error adding favorite:", err);
    }
    };


  return (
    <>
      <FontAwesomeIcon icon={isFavorited ? faBookmarkSolid : faBookmarkRegular} size="lg" className="fav-icon" role="button" onClick={handleClick} />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="fav-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Choose List</h4>
            {loadingLists ? (
              <p>Loading...</p>
            ) : favoriteLists.length === 0 ? (
              <p>You have no lists available</p>
            ) : (
              <ul>
                {favoriteLists.map((list) => (
                  <li key={list.id}>
                    <button onClick={() => handleFavourite(list.id)}>
                      {list.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
