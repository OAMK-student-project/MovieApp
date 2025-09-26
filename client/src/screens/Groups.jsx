import { useEffect, useState } from "react";
import axios from "axios";
import "./Groups.css";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);// track requests sent
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:3001/groups", {
          headers: { Accept: "application/json" },
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

   const requestJoinGroup = async (groupId) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/groups/${groupId}/request-join`,
        { user_id: 1 } // replace with actual logged-in user ID   NEED TO CHANGE for logged in users only
      );
      alert(res.data.message || "Join request sent");
      setRequests((prev) => [...prev, groupId]); // mark group as requested
    } catch (err) {
      console.error("Error sending join request:", err);
      if (err.response && err.response.data) {
        alert(err.response.data); // show backend error message
      } else {
        alert("Failed to send join request");
      }
    }
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div className="groupcontainer">
      <h2>All groups</h2>
     
     
     
      {groups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <div key={group.id} className="groups-card">
              {group.name}{" "}
              <button className="groups-button" onClick={() => requestJoinGroup(group.id)}>Join</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Groups;