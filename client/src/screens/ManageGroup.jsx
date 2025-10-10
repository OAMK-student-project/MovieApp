
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true; // tärkeitä httpOnly-cookien kanssa

export default function ManageGroup() {
  const { id } = useParams(); // ryhmän id URLista
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  // Hae ownerin id ja liittymispyynnöt
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Hae ownerin id
        const ownerRes = await axios.get(
          `http://localhost:3001/groups/${id}/owner`
        );
        const ownerId = ownerRes.data.ownerId;

        // 2. Hae kirjautuneen käyttäjän id (backend palauttaa sen tokenin perusteella)
        const meRes = await axios.get(`http://localhost:3001/user/me`);
        const currentUserId = meRes.data.id;

        setIsOwner(ownerId === currentUserId);

        if (ownerId !== currentUserId) {
          setLoading(false);
          return; // ei omistajaa -> ei latausta liittymispyynnöistä
        }

        // 3. Hae liittymispyynnöt
        const reqRes = await axios.get(
          `http://localhost:3001/groups/${id}/requests`
        );
        setRequests(Array.isArray(reqRes.data.requests) ? reqRes.data.requests : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRequest = async (requestId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/groups/${id}/requests/${requestId}`,
        { status }
      );

      alert(res.data.message || `Request ${status}`);

      setRequests((prev) =>
        prev.filter((r) => r.request_id !== requestId)
      );
    } catch (err) {
      console.error("Error updating request:", err);
      alert("Failed to update request.");
    }
  };
const handleLeaveGroup = async () => {
  try {
    const res = await axios.delete(`http://localhost:3001/groups/${id}/leave`);
    alert(res.data.message);
    
  } catch (err) {
    console.error("Error leaving group:", err);
    alert("Failed to leave group.");
  }
};
// tapahtumakäsitelijä ryhmän poistolle
const handleDeleteGroup = async () => {
  if (!window.confirm("Are you sure you want to delete this group? This cannot be undone.")) {
    return;
  }

  try {
    const res = await axios.delete(`http://localhost:3001/groups/${id}`);
    alert(res.data.message);
   
    window.location.href = "/groups";
  } catch (err) {
    console.error("Error deleting group:", err);
    alert("Failed to delete group.");
  }
};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
 

  return (
    <div className="grid-container">
       {/* Left side */}
       <div className="container">
      <h2>Manage Group</h2>
      <h3>Group members</h3>
        
        
        
        <button onClick={handleLeaveGroup} style={{ marginBottom: "16px" }}>
    Leave Group
  </button>
        </div>
     
      {/* Right side */}
      
      <div className="container">
      <h3>Join Requests</h3>
  
   {requests.length > 0 ? (
      <table >
        <thead>
          <tr>
            <th >First Name</th>
            <th >Last Name</th>
            <th >Email</th>
            <th >Status</th>
            <th >Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.request_id}>
              <td>{req.firstname ?? "Unknown"}</td>
              <td>{req.lastname ?? ""}</td>
              <td>{req.email ?? "No email"}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleRequest(req.request_id, "approved")}
                      style={{ marginRight: "4px" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequest(req.request_id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 

      
      ) : (
        <p>No join requests for this group.</p>
      )}
    </div>
 {/* Full width bottom */}
      <div className="container full-width">
        
        {isOwner && (

<button onClick={handleDeleteGroup}>Delete Group</button>
)}
        
      </div>
    </div>
 
 
 
  );
}