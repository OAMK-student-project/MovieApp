import axios from "axios";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as faPlusIcon } from '@fortawesome/free-solid-svg-icons';
import { faTrash as faTrashIcon } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare as faEditIcon } from '@fortawesome/free-solid-svg-icons';
import "./FavoriteList.css";

function FavoriteList() {
  const { user, accessToken } = useContext(UserContext); 
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editListName, setEditListName] = useState("");

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
    getLists(); // optional if you want to refresh from server
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
        {lists.map((list) => (
          <li className="favListLi" key={list.id}>
            {list.name}
            <div className="actionButtons">
              <button className="editBtn" onClick={() => openModal(list)}>
                <FontAwesomeIcon icon={faEditIcon} size="lg" />
              </button>
              <button className="trashBtn" onClick={() => removeList(list.id)}>
                <FontAwesomeIcon icon={faTrashIcon} size="lg" />
              </button>
            </div>
          </li>
        ))}
      </ul>

{/*--------- Edit modal ------------*/}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="favList-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Insert new list name:</h4>
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
    </div>
  );
}

export default FavoriteList;
