import { useEffect, useState } from "react";
import axios from "axios";
import "./AllGroups.css";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedGroups, setRequestedGroups] = useState([]); // ryhmät, joihin pyyntö lähetetty

  useEffect(() => {
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

    fetchGroups();
  }, []);

  const requestJoinGroup = async (groupId) => {
    if (requestedGroups.includes(groupId)) return; // turva duplikaatteja vastaan frontendissä

    try {
      const res = await axios.post(
        `http://localhost:3001/groups/${groupId}/request-join`,
        { user_id: 1 } // TODO: korvaa kirjautuneen käyttäjän ID:llä
      );
      alert(res.data.message || "Join request sent");

      // lisää ryhmä heti 'requested' listaan
      setRequestedGroups((prev) => [...prev, groupId]);
    } catch (err) {
      console.error("Error sending join request:", err);

      if (err.response && err.response.data&& err.response.data.message) {
        alert(err.response.data.message );
      } else {
        alert("Failed to send join request");
      }

      // jos virhe duplikaatti, lisää ryhmä myös requested-listaan
      if (err.response?.status === 400 && err.response?.data?.message?.includes("already sent")) {
        setRequestedGroups((prev) => [...prev, groupId]);
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