import { useEffect, useState } from "react";
import axios from "axios";
import "./Groups.css";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  
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

  const joinGroup = async (groupId) => {
    try {
      // Esimerkki kutsu – toteuta backendissa vastaava POST /groups/:id/join
      const res = await axios.post(
        `http://localhost:3001/groups/${groupId}/join`,
        { user_id: 1 } // kovakoodattu testikäyttäjä
      );
      alert(`Joined group: ${res.data.name}`);
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Failed to join group");
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
              <button className="groups-button" onClick={() => joinGroup(group.id)}>Join</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Groups;