/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ManageGroup() {
  const { id } = useParams(); // ryhmän id URLista
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hae liittymispyynnöt
  useEffect(() => {
  const fetchJoinRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/groups/${id}/requests`);
      // res.data.requests on se taulukko, jota käytämme
      setRequests(Array.isArray(res.data.requests) ? res.data.requests : []);
    } catch (err) {
      console.error("Error fetching join requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  fetchJoinRequests();
}, [id]);
  // Hyväksy / hylkää pyyntö
  const handleRequest = async (requestId, status) => {
  try {
    const res = await axios.put(
      `http://localhost:3001/groups/${id}/requests/${requestId}`,
      { status }
    );
    alert(res.data.message || `Request ${status}`);

    if (status === "rejected") {
      // poista rivistä kokonaan
      setRequests((prev) => prev.filter((r) => r.request_id !== requestId));
    } else {
      // päivitä vain status
      setRequests((prev) =>
        prev.map((r) => (r.request_id === requestId ? { ...r, status } : r))
      );
    }
  } catch (err) {
    console.error("Error updating request:", err);
    alert("Failed to update request");
  }
};

  if (loading) return <p>Loading join requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Manage Group</h2>
      <h3>Join Requests</h3>

      {Array.isArray(requests) && requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req.request_id}>
              {req.firstname ?? "Unknown"} {req.lastname ?? ""} ({req.email ?? "No email"}) –{" "}
              <strong>{req.status}</strong>
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => handleRequest(req.request_id, "approved")}
                    style={{ marginLeft: "8px" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(req.request_id, "rejected")}
                    style={{ marginLeft: "4px" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No join requests for this group.</p>
      )}
    </div>
  );
}*/

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!isOwner) return <p>Only the group owner can manage join requests.</p>;

  return (
    <div>
      <h2>Manage Group</h2>
      <h3>Join Requests</h3>

      {requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req.request_id}>
              {req.firstname ?? "Unknown"} {req.lastname ?? ""} ({req.email ?? "No email"}) –{" "}
              <strong>{req.status}</strong>
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => handleRequest(req.request_id, "approved")}
                    style={{ marginLeft: "8px" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(req.request_id, "rejected")}
                    style={{ marginLeft: "4px" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No join requests for this group.</p>
      )}
    </div>
  );
}