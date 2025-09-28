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

//This is partly just for debug, basically checks for changes in user data whether or not we have the userID and token.
  useEffect(() => {
    //console.log("UserContext updated:", user, accessToken); //DEBUG
    if (user || accessToken === null) setLoadingUser(false);
    getLists();
  }, [user, accessToken]);

//Add a fav list
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

  

//Show text if user not logged in and show text if logged in but user data has not been fethed
  if (loadingUser) {
    return <p>Loading...</p>;
  }

  if (!user?.userID || !accessToken) {
    return <p>Please sign in to add a favorite list</p>;
  }

return (
    <div className="favorite-list-container">
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
      <ul className="favListUl">
        {lists.map((list) => (
          <li className="favListLi" key={list.id}>{list.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteList;
