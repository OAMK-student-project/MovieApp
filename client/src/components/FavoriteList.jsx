import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faSquareCaretDown, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteList.css";
import { addList, getLists, editList, removeList, fetchMovies, shareList } from "../helpers/favoriteListHelper.js";
import UserContext from "../context/UserContext";

function FavoriteList() {
  const url = import.meta.env.VITE_API_URL;
  const { user } = useContext(UserContext);

  // ---------- State ----------
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editListName, setEditListName] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [moviesByList, setMoviesByList] = useState({});
  const [loadingMovies, setLoadingMovies] = useState(false);

  // ---------- Effects ----------
useEffect(() => {
  if (!user) return; // skip if not logged in

  const fetchLists = async () => {
    setLoadingLists(true);
    try {
      const data = await getLists();
      setLists(data);
    } catch (err) {
      console.error("Error fetching lists:", err);
    } finally {
      setLoadingLists(false);
    }
  };

  fetchLists();
}, [user]);


  // ---------- Handlers ----------
  const handleAddList = async () => {
    try {
      const data = await addList(newListName);
      setLists(prev => [...prev, data]);
      setNewListName("");
    } catch (err) {
      console.error("Error adding list:", err);
      alert(err.message);
    }
  };

  const handleEditList = async () => {
    try {
      await editList(editingListId, editListName);
      setLists(prev =>
        prev.map(list => (list.id === editingListId ? { ...list, name: editListName } : list))
      );
      setShowModal(false);
      setEditingListId(null);
      setEditListName("");
    } catch (err) {
      console.error("Error editing list:", err);
      alert(err.message);
    }
  };

  const handleRemoveList = async (listId) => {
    try {
      await removeList(listId);
      setLists(prev => prev.filter(list => list.id !== listId));
    } catch (err) {
      console.error("Error removing list:", err);
      alert(err.message);
    }
  };

  const toggleExpand = async (listId) => {
    if (expandedId === listId) {
      setExpandedId(null);
    } else {
      setExpandedId(listId);
      if (!moviesByList[listId]) {
        setLoadingMovies(true);
        try {
          const movies = await fetchMovies(listId);
          setMoviesByList(prev => ({ ...prev, [listId]: movies }));
        } catch (err) {
          console.error("Error fetching movies:", err);
        } finally {
          setLoadingMovies(false);
        }
      }
    }
  };

  const handleShareList = async (listId) => {
    try {
      const shareUrl = await shareList(listId);
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        alert(`Share link copied:\n${shareUrl}`);
        setLists(prev => prev.map(list => (list.id === listId ? { ...list, is_shared: true } : list)));
      }
    } catch (err) {
      console.error("Error sharing list:", err);
      alert("Could not share list");
    }
  };

  const openModal = (list) => {
    setEditingListId(list.id);
    setEditListName(list.name);
    setShowModal(true);
  };

// ---------- JSX ----------
  if (!user) { //Show text if not logged in
    return (
      <div className="favorite-list-container">
        <div className="fav-login">
          <h3>Please <u>sign in</u> to view your favorite lists.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-list-container">
      {/* Add new list */}
      <div className="favourite-list-row">
        <button className="addBtn" onClick={handleAddList}>
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </button>
        <input
          className="listInput"
          type="text"
          placeholder="Enter new list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
      </div>

      {loadingLists ? <p>Loading lists...</p> : (
        <ul className="favListUl">
          {lists.map(list => {
            const isExpanded = expandedId === list.id;
            const movies = moviesByList[list.id] || [];
            return (
              <li className="favListLi" key={list.id}>
                <div className="favListHeader">
                  <span className="favListName">{list.name}</span>
                  {list.is_shared && <p className="sharedText">Shared!</p>}
                  <div className="actionButtons">
                    <button className={`expandBtn ${isExpanded ? "rotated" : ""}`} onClick={() => toggleExpand(list.id)}>
                      <FontAwesomeIcon icon={faSquareCaretDown} size="lg" />
                    </button>
                    <button className="shareBtn" onClick={() => handleShareList(list.id)}>
                      <FontAwesomeIcon icon={faShareFromSquare} size="lg" />
                    </button>
                    <button className="editBtn" onClick={() => openModal(list)}>
                      <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                    </button>
                    <button className="trashBtn" onClick={() => handleRemoveList(list.id)}>
                      <FontAwesomeIcon icon={faTrash} size="lg" />
                    </button>
                  </div>
                </div>

                {/* Edit modal */}
                {showModal && editingListId === list.id && (
                  <div className="modal-overlay">
                    <div className="favList-modal">
                      <h3>Edit List</h3>
                      <input
                        className="listInput"
                        type="text"
                        value={editListName}
                        onChange={(e) => setEditListName(e.target.value)}
                      />
                      <div className="actionButtons">
                        <button className="saveBtn" onClick={handleEditList}>Save</button>
                        <button className="cancelBtn" onClick={() => setShowModal(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded movies */}
                {isExpanded && (
                  <div className="favListExpand">
                    {loadingMovies && movies.length === 0 ? (
                      <p>Loading movies...</p>
                    ) : movies.length === 0 ? (
                      <p>No movies found for this list.</p>
                    ) : (
                      <div className="movieGrid">
                        {movies.map(movie => (
                          <div className="movieCard" key={movie.id}>
                            <p className="movieTitle">{movie.title}</p>
                            <p className="movieGenres">{movie.genres.join(", ")}</p>
                            <p className="movieAdded">{movie.added_at}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FavoriteList;
