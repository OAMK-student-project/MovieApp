import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid, faTrash as faBookmarkRemove } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import UserContext from "../context/UserContext";
import { getLists, favouritesByUser, addFavoriteMovie, removeFavoriteMovie } from "../helpers/favoriteBtnHelper.js";
import "./AddFavoriteBtn.css";

export default function AddFavoriteBtn({ movie }) {
  const { user } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [favouriteId, setFavouriteId] = useState(null);

 

  // Check if movie is already favorited
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user) return;
      try {
        const favourites = await favouritesByUser();
        const favRecord = favourites.find(f => String(f.movie_id) === String(movie.id));
        if (favRecord) {
          setIsFavorited(true);
          setFavouriteId(favRecord.id);
        } else {
          setIsFavorited(false);
          setFavouriteId(null);
        }
      } catch (err) {
        console.error("Error checking favourites:", err);
      }
    };

    checkIfFavorited();
  }, [user, movie.id]);


  // Open modal and fetch lists
  const handleClick = async () => {
    if (isFavorited) {
      handleRemoveFavourite();
      return;
    }

    setShowModal(true);

    if (favoriteLists.length === 0 && user) {
      setLoadingLists(true);
      try {
        const lists = await getLists();
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
  try {
    const addedFav = await addFavoriteMovie(movie, listId);
    setIsFavorited(true);
    setFavouriteId(addedFav.id);
    setShowModal(false);
  } catch (err) {
    console.error(err);
  }
};

const handleRemoveFavourite = async () => {
  try {
    await removeFavoriteMovie(movie.id);
    setIsFavorited(false);
    setFavouriteId(null);
  } catch (err) {
    console.error(err);
  }
};

  // Render nothing if no user
  if (!user) {
    return <></>; // or null
  }

  return (
    <>
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <FontAwesomeIcon icon={ isFavorited ? hovering ? faBookmarkRemove : faBookmarkSolid : faBookmarkRegular } size="lg"
          className={`fav-icon ${isFavorited ? "favorited" : ""}`} role="button" onClick={handleClick}/>
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
