import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyGroups.css";
export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1; // TODO: vaihda kirjautuneen käyttäjän ID:hen

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${userId}/groups`);
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching user groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [userId]);

  if (loading) return <p>Loading your groups...</p>;
  if (groups.length === 0) return <p>You are not a member of any groups.</p>;

  return (
    <div className="mygroups-container">
      <h2>My Groups</h2>
     
      <div className="mygroups-grid">
        {groups.map((group) => ( <Link to={`/grouppage/${group.id}`}
          key={group.id}
          className="mygroups-card">
            {group.name}
          </Link>
          
        ))}
      </div>
    </div>
  );
}