import axios from "axios";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare as faEditIcon,faTrash as faTrashIcon, faPlus as faPlusIcon, faSquareCaretDown as faExpand  } from '@fortawesome/free-solid-svg-icons';
import "./FavoriteList.css";

function FavoriteList() {
  const { user, accessToken } = useContext(UserContext);
  //Create 
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  //Edit
  const [showModal, setShowModal] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editListName, setEditListName] = useState("");
  //Expando
  const [expandedId, setExpandedId] = useState(null);
  const [moviesByList, setMoviesByList] = useState({}); // { [listId]: movies[] }
  const [loadingMovies, setLoadingMovies] = useState(false);

//This is partly just for debug, basically checks for changes in user data whether or not we have the userID and token.
  useEffect(() => {
    //console.log("UserContext updated:", user, accessToken); //DEBUG
    if (user || accessToken === null) setLoadingUser(false);
    getLists();
  }, [user, accessToken]);

//-----------Add lists
  const addList = async () => {
    if (!user?.userID || !accessToken) return; //must have access token

    if (!newListName.trim()) {
      alert("Please enter a list name");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/favourite-lists`,
        { list_name: newListName },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, //use access token
          },
        }
      );

      console.log("New list created:", data);
      setLists(prev => [...prev, data]);
      setNewListName("");
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Could not create list");
    }
    getLists();
  };
  
//-----------Get lists
//Fetch the lists user has created
  const getLists = async () => {
    if (!user?.userID || !accessToken) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/favourite-lists`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      //DEBUG console.log("Fetched lists:", data);
      setLists(data); // put API response into state
    } catch (error) {
      console.error("Error fetching lists:", error);
      alert("Could not fetch lists");
    }
  };

//-----------Edit list
  //Modal stuff
  const openModal = (list) => {
    setEditingListId(list.id);
    setEditListName(list.name);
    setShowModal(true);
  };

  const editList = async () => {
    if (!editListName.trim()) return alert("Please enter a list name");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/favourite-lists/${editingListId}`,
        { name: editListName },
        { headers: { "Authorization": `Bearer ${accessToken}` } }
      );

      // update state
      setLists(prev =>
        prev.map(list =>
          list.id === editingListId ? { ...list, name: editListName } : list
        )
      );

      setShowModal(false);
      setEditingListId(null);
      setEditListName("");
    } catch (error) {
      console.error("Error updating list:", error);
    }
  }

//-----------Remove list
  const removeList = async (listId) => {
    if (!user?.userID || !accessToken) return; // must have access token
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/favourite-lists/${listId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      // Update state by filtering out the deleted list
      setLists(prev => prev.filter(list => list.id !== listId));

      console.log("List deleted:", listId);
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Could not delete list");
    }
    getLists();
  };


//-----------Toggle list expand
  const toggle = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // collapse
    } else {
      setExpandedId(id); // expand
      console.log("expanded: " + expandedId);
      // Fetch movies if not already cached
      if (!moviesByList[id]) {
        fetchMovies(id);
      }
    }
  };

//-----------Fetch movies for a specific list
const fetchMovies = async (favouriteId) => {
  if (!user?.userID || !accessToken) return;
  try {
    setLoadingMovies(true);
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/favourite/movies?favourite_id=${favouriteId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );
    setMoviesByList((prev) => ({
      ...prev,
      [favouriteId]: res.data,
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    setLoadingMovies(false);
  }
};

//Show text if user not logged in and show text if logged in but user data has not been fethed
  if (loadingUser) {
    return <p>Loading...</p>;
  }

  if (!user?.userID || !accessToken) {
    return <p>Please sign in to add a favorite list</p>;
  }


  return (
    <div className="favorite-list-container">

      {/*--------- Add list ------------*/}
      <div className="favourite-list-row">
        <button className="addBtn" onClick={addList}>
          <FontAwesomeIcon icon={faPlusIcon} size="lg" />
        </button>
        <input
          className="listInput"
          type="text"
          placeholder="Enter new list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
      </div>

      {/*--------- Lists ------------*/}
      <ul className="favListUl">
        {lists.map((list) => {
          const isExpanded = expandedId === list.id;
          const movies = moviesByList[list.id] || [];

          return (
            <li className="favListLi" key={list.id}>
              <div className="favListHeader">
                <span className="favListName">{list.name}</span>
                <div className="actionButtons">
                  <button
                    className={`expandBtn ${isExpanded ? "rotated" : ""}`}
                    onClick={() => toggle(list.id)}
                  >
                    <FontAwesomeIcon icon={faExpand} size="lg" />
                  </button>

                  <button className="editBtn" onClick={() => openModal(list)}>
                    <FontAwesomeIcon icon={faEditIcon} size="lg" />
                  </button>

                  <button className="trashBtn" onClick={() => removeList(list.id)}>
                    <FontAwesomeIcon icon={faTrashIcon} size="lg" />
                  </button>
                </div>
              </div>

              {/* Edit List */}
              {showModal && (
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
                      <button className="saveBtn" onClick={editList}>Save</button>
                      <button className="cancelBtn" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <div className="favListExpand">
                  {loadingMovies && movies.length === 0 ? (
                    <p>Loading movies...</p>
                  ) : movies.length === 0 ? (
                    <p>No movies found for this list.</p>
                  ) : (
                    <div className="movieGrid">
                      {movies.map((movie) => (
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
    </div>
  );
}
export default FavoriteList;
