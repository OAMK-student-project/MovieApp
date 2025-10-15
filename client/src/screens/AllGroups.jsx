
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./AllGroups.css";
import toast from "react-hot-toast";

function AllGroups() {
 
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedGroups, setRequestedGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/groups`, { withCredentials: true });
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const requestJoinGroup = async (groupId) => {
    if (requestedGroups.includes(groupId)) return;

    try {
      const res = await axios.post(
        `${API_URL}/groups/${groupId}/request-join`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Join request sent");
      setRequestedGroups(prev => [...prev, groupId]);
    } catch (err) {
      console.error("Error sending join request:", err);
      toast.error(err.response?.data?.message || "Failed to send join request");
      if (err.response?.status === 400 && err.response?.data?.message?.includes("already sent")) {
        setRequestedGroups(prev => [...prev, groupId]);
      }
    }
  };

  const addGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
    `${API_URL}/groups`,
        { name: newGroupName },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Group created");
      setNewGroupName("");
      fetchGroups();
    } catch (err) {
      console.error("Error adding group:", err);
      toast.error(err.response?.data?.message || "Failed to add group");
    }
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="allgroups-container">
      <h2>Add a group</h2>
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
          {groups.map(group => (
            <div key={group.id} className="allgroups-card"
             data-emoji={group.emoji || "👽"}
             >
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
