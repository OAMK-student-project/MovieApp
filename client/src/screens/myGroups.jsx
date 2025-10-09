
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser"; // oletetaan, että täällä on user.id ja accessToken
import { Link } from "react-router-dom";
import "./MyGroups.css";

export default function MyGroups() {
  const { user } = useUser(); // user.id ja mahdollisesti user.accessToken
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // ei kirjautunut -> ei haeta
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // tai user.accessToken
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/groups/me`, // reitti backendissä
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  if (!user) return <p>User not logged in.</p>;
  if (loading) return <p>Loading your groups...</p>;
  if (groups.length === 0) return <p>You are not a member of any groups.</p>;

  return (
    <div className="mygroups-container">
      <h2>My Groups</h2>
      <div className="mygroups-grid">
        {groups.map((group) => (
          <Link
            to={`/grouppage/${group.id}`}
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