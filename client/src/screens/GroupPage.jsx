import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function GroupPage() {
  const { id } = useParams(); // Get group ID from URL
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token"); // your auth token
        const res = await axios.get(`http://localhost:3001/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to fetch group");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  if (loading) return <p>Loading group...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div>
      <h2>GroupPage</h2>
      <h3>{group.name}</h3>
      <Link to={`/managegroup/${group.id}`}>
        <h4>Go to Manage Group</h4>
      </Link>
    </div>
  );
}