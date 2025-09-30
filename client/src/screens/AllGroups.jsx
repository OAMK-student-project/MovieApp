import { useEffect, useState } from "react";
import axios from "axios";
import "./AllGroups.css"; // vaihda myös CSS-tiedoston nimi

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]); // track requests sent
  
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
        { user_id: 1 } // TODO: vaihda kirjautuneen käyttäjän ID:hen
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
   
  
   <div className="allgroups-container">
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
                disabled={requests.includes(group.id)} // disable if already requested
              >
                {requests.includes(group.id) ? "Requested" : "Join"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllGroups;