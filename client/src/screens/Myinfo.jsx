import axios from "axios";
import { useEffect, useState } from "react";
import "./Myinfo.css";

export default function Myinfo() {
  const [user, setUser] = useState(null); // from backend
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState(""); // optional, can come from token
  const [loading, setLoading] = useState(true);
   
  // Decode JWT from localStorage
  const token = localStorage.getItem("token");
  let jwtPayload = null;
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      jwtPayload = JSON.parse(atob(base64));
    } catch (err) {
      console.error("Failed to parse token:", err);
    }
  }

  // Set email from token immediately
  useEffect(() => {
    if (jwtPayload?.email) setEmail(jwtPayload.email);
  }, [jwtPayload]);

  // Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:3001/user/me", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFirstname(response.data.firstname || "");
        setLastname(response.data.lastname || "");
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Update user profile
  const updateUser = async () => {
    if (!token) return;
    try {
      const res = await axios.put(
        "http://localhost:3001/user/me",
        { firstname, lastname, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  // Delete user profile
  const deleteUser = async () => {
    if (!token) return;
    try {
      await axios.delete("http://localhost:3001/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Your profile has been deleted.");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      alert("Failed to delete profile");
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="grid-container">
      {/* Left side */}
      <div className="container">
        <h3>Myinfo</h3>

        <h4>Current User Info (from token/backend)</h4>
        <p>User ID: {jwtPayload?.sub || "N/A"}</p>
        <p>Email: {email || "N/A"}</p>
        <p>First Name: {user?.firstname || "Not available"}</p>
        <p>Last Name: {user?.lastname || "Not available"}</p>

        <p>Edit First Name:</p>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <p>Edit Last Name:</p>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        <p>Edit Email:</p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="button" onClick={updateUser}>
          Save changes
        </button>
      </div>

      {/* Right side */}
      <div className="container">
        <h3>Reset password</h3>
        <p>Old password</p>
        <input type="password" placeholder="Old password" />
        <p>New password</p>
        <input type="password" placeholder="New password" />
        <p>Confirm password</p>
        <input type="password" placeholder="Confirm new password" />
        <button type="button">Change password</button>
      </div>

      {/* Full width bottom */}
      <div className="container full-width">
        <p>
          Note that by deleting your profile, you will{" "}
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            permanently
          </span>{" "}
          lose access to all of your data on your account including favourites,
          groups, and reviews.
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "By deleting account you will lose all access to it, are you sure?"
              )
            ) {
              deleteUser();
            }
          }}
        >
          Delete my profile
        </button>
      </div>
    </div>
  );
}