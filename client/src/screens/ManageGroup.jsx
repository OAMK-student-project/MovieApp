import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ManageGroup() {
  const { id } = useParams(); // ottaa ryhmän id:n urlista (/managegroup/:id)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/groups/${id}/requests`);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching join requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, [id]);

  if (loading) return <p>Loading join requests...</p>;

  return (
    <div>
      <h2>Manage Group</h2>
      
      <h2>Join requests</h2>
      {requests.length === 0 ? (
        <p>No join requests for this group.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              {req.username} ({req.email})
              {/* Voit lisätä hyväksy/hylkää -napit tähän */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}