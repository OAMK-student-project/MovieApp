import { useEffect, useState } from "react";
import axios from "axios";
import "./AllGroups.css";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedGroups, setRequestedGroups] = useState([]); 
  const [newGroupName, setNewGroupName] = useState(""); // uutta ryhmää varten

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:3001/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      alert("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const requestJoinGroup = async (groupId) => {
    if (requestedGroups.includes(groupId)) return;

    try {
      const res = await axios.post(
        `http://localhost:3001/groups/${groupId}/request-join`,
        { user_id: 1 } // TODO: korvaa kirjautuneen käyttäjän ID:llä
      );
      alert(res.data.message || "Join request sent");

      setRequestedGroups((prev) => [...prev, groupId]);
    } catch (err) {
      console.error("Error sending join request:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to send join request");
      }

      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("already sent")
      ) {
        setRequestedGroups((prev) => [...prev, groupId]);
      }
    }
  };

  const addGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/groups", {
        name: newGroupName,
      });

      alert(res.data.message || "Group created");
      setNewGroupName(""); // tyhjennä kenttä
      fetchGroups(); // hae uudelleen, jotta uusi ryhmä näkyy listassa
    } catch (err) {
      console.error("Error adding group:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to add group");
      }
    }
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="allgroups-container">
      <h3>Add a group</h3>
      <div className="allgroups-add">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button className="allgroups-button" onClick={addGroup}>
          Add a group
        </button>
      </div>

      <h2>All Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <div className="allgroups-grid">
          {groups.map((group) => (
            <div key={group.id} className="allgroups-card">
              {group.name}{" "}
              <button
                className="allgroups-button"
                onClick={() => requestJoinGroup(group.id)}
                disabled={requestedGroups.includes(group.id)}
              >
                {requestedGroups.includes(group.id) ? "Requested" : "Join"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllGroups;