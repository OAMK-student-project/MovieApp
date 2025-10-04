import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid, faTrash as faBookmarkRemove } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import UserContext from "../context/UserContext";
import { addFavorites, getLists, favouritesByUser } from "../helpers/favoriteHelper.js";
import "./AddFavoriteBtn.css";

export default function AddFavoriteBtn({ movie }) {
  const { user, accessToken } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hovering, setHovering] = useState(false); // <-- track hover state
  const [showModal, setShowModal] = useState(false);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Check if movie is already favorited
const [favouriteId, setFavouriteId] = useState(null); // store DB id of the favourite record

useEffect(() => {
  const checkIfFavorited = async () => {
    if (!user || !accessToken) return;
    try {
      const favourites = await favouritesByUser(accessToken);

      const favRecord = favourites.find(
        (f) => String(f.movie_id) === String(movie.id)
      );

      if (favRecord) {
        setIsFavorited(true);
        setFavouriteId(favRecord.id); // store the DB favourite id
      } else {
        setIsFavorited(false);
        setFavouriteId(null);
      }
    } catch (err) {
      console.error("Error checking favourites:", err);
    }
  };

  checkIfFavorited();
}, [user, accessToken, movie.id]);


  // Open modal and fetch lists
  const handleClick = async () => {
    if (isFavorited) {
      handleRemoveFavourite();
      return;
    }

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
        ? movie.genres.map((g) => (typeof g === "object" ? g.name : g)).join(", ")
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

  // Remove movie from favourites
const handleRemoveFavourite = async () => {
  if (!accessToken || !user?.userID) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/favourite`, {
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
      data: { movieId: movie.id },
    });

    setIsFavorited(false);
  } catch (error) {
    console.error("Error removing favourite:", error);
    alert("Could not remove favourite");
  }
};


  return (
    <>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <FontAwesomeIcon icon={ isFavorited ? hovering
                ? faBookmarkRemove // show remove icon on hover
                : faBookmarkSolid // normal solid when favorited
                : faBookmarkRegular // normal unselected
          }
          size="lg"
          className={`fav-icon ${isFavorited ? "favorited" : ""}`}
          role="button"
          onClick={handleClick}
        />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="fav-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Your favourite lists</h4>
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
            <button
              className="fav-cancelBtn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
