
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./GroupPage.css";
import "./ManageGroup.css";

axios.defaults.withCredentials = true; // tärkeitä httpOnly-cookien kanssa

export default function ManageGroup() {
  const { id } = useParams(); // ryhmän id URLista
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Hae ownerin id ja liittymispyynnöt
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Hae ownerin id
        const ownerRes = await axios.get(
          `${API_URL}/groups/${id}/owner`
        );
        const ownerId = ownerRes.data.ownerId;

        // 2. Hae kirjautuneen käyttäjän id (backend palauttaa sen tokenin perusteella)
        const meRes = await axios.get(`${API_URL}/user/me`);
        const currentUserId = meRes.data.id;

        setIsOwner(ownerId === currentUserId);

        if (ownerId !== currentUserId) {
          setLoading(false);
          return; // ei omistajaa -> ei latausta liittymispyynnöistä
        }

        // 3. Hae liittymispyynnöt
        const reqRes = await axios.get(
          `${API_URL}/groups/${id}/requests`
        );
        setRequests(Array.isArray(reqRes.data.requests) ? reqRes.data.requests : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRequest = async (requestId, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/groups/${id}/requests/${requestId}`,
        { status }
      );

      toast.success(res.data.message || `Request ${status}`);

      setRequests((prev) =>
        prev.filter((r) => r.request_id !== requestId)
      );
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error("Failed to update request.");
    }
  };


const handleLeaveGroup = async () => {
    toast.custom((t) => (
      <div className={`toast-modal-overlay ${t.visible ? "show" : "hide"}`}>
        <div className="toast-modal">
          <p>Are you sure you want to leave this group?</p>
          <div className="toast-modal-buttons">
            <button className="toast-btn cancel-btn" onClick={() => toast.dismiss(t.id)}>Cancel</button>
            <button
              className="toast-btn delete-btn"
              onClick={async () => {
                try {
                  const res = await axios.delete(`${API_URL}/groups/${id}/leave`);
                  toast.success(res.data.message);
                } catch (err) {
                  console.error("Error leaving group:", err);
                  toast.error("Failed to leave group");
                } finally {
                  toast.dismiss(t.id);
                }
              }}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
  };

  
const handleDeleteGroup = async () => {
    toast.custom((t) => (
      <div className={`toast-modal-overlay ${t.visible ? "show" : "hide"}`}>
        <div className="toast-modal">
          <p>Are you sure you want to delete this group? This cannot be undone.</p>
          <div className="toast-modal-buttons">
            <button className="toast-btn cancel-btn" onClick={() => toast.dismiss(t.id)}>Cancel</button>
            <button
              className="toast-btn delete-btn"
              onClick={async () => {
                try {
                  const res = await axios.delete(`${API_URL}/groups/${id}`);
                  toast.success(res.data.message);
                  window.location.href = "/groups";
                } catch (err) {
                  console.error("Error deleting group:", err);
                  toast.error("Failed to delete group");
                } finally {
                  toast.dismiss(t.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ), { duration: Infinity });
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