
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser"; // oletetaan, että täällä on user.id ja accessToken
import { Link } from "react-router-dom";
import "./MyGroups.css";

export default function MyGroups() {
  const { user } = useUser(); // user.id ja mahdollisesti user.accessToken
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
   const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!user) return; // ei kirjautunut -> ei haeta
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/me`,{ withCredentials: true });
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  if (!user) return <p>You need to login to see your groups</p>;
  if (loading) return <p>Loading your groups...</p>;
  if (groups.length === 0) return <p>You are not yet a member of any groups.</p>;

  return (
    <div className="mygroups-container">
      <h2>My Groups</h2>
      <div className="mygroups-grid">
        {groups.map((group) => (
          <Link
            to={`/groups/${group.id}`}
            key={group.id}
            className="mygroups-card"
          >
            {group.name}
          </Link>
        ))}
      </div>
    </div>
  );
}