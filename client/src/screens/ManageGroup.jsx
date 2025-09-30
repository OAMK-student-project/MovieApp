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
console.log("group id from URL:", id);// debug pätkä
  return (
    <div>
      <h2>Manage Group</h2>
      
      <h2>Join requests</h2>
      {requests.length === 0 ? (
        <p>No join requests for this group.</p>
      ) : (
        
      <ul>
  {requests.map((req) => (
    <li key={req.request_id}>
  {req.firstname ?? "Unknown"} {req.lastname ?? ""} ({req.email ?? "No email"}) – <strong>{req.status}</strong>
  {req.status === "pending" && (
    <>
      <button onClick={() => handleRequest(req.request_id, "approved")}>Approve</button>
      <button onClick={() => handleRequest(req.request_id, "rejected")}>Reject</button>
    </>
  )}
</li>
  ))}
</ul>
        
      )}
    </div>
  );
}