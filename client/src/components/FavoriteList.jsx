import axios from "axios";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as faPlusIcon } from '@fortawesome/free-solid-svg-icons';
import "./FavoriteList.css";

//Had to expose accessToken in UserProvider to authenticate

function FavoriteList() {
  const { user, accessToken } = useContext(UserContext); 
  const [newListName, setNewListName] = useState("");
  const [lists, setLists] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    console.log("UserContext updated:", user, accessToken);
    if (user || accessToken === null) setLoadingUser(false);
  }, [user, accessToken]);

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
  };

  if (loadingUser) {
    return <p>Loading...</p>;
  }

  if (!user?.userID || !accessToken) {
    return <p>Please sign in to add a favorite list</p>;
  }

  return (
    <div className="favorite-list-container">
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

      <ul>
        {lists.map(list => <li key={list.id || list.list_name}>{list.list_name}</li>)}
      </ul>
    </div>
  );
}

export default FavoriteList;
