import { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import "./Myinfo.css";

axios.defaults.withCredentials = true;

export default function Myinfo() {
  const { user, signin, signout } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Hae käyttäjä backendistä
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3001/user/me", { withCredentials: true });
        setUserData(res.data);
        setFirstname(res.data.firstname || "");
        setLastname(res.data.lastname || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Päivitä profiili
  const updateUser = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3001/user/me",
        { firstname, lastname, email },
        { withCredentials: true }
      );
      setUserData(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  // Poista käyttäjä
  const deleteUser = async () => {
    try {
      await axios.delete("http://localhost:3001/user/me", { withCredentials: true });
      alert("Your profile has been deleted.");
      await signout(); // Tyhjennä frontend state
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

        <h4>Current User Info </h4>
        <p>User ID: {userData?.id || "N/A"}</p>
        <p>Email: {userData?.email || "N/A"}</p>
        <p>First Name: {userData?.firstname || "Not available"}</p>
        <p>Last Name: {userData?.lastname || "Not available"}</p>

        <p>Edit First Name:</p>
        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />

        <p>Edit Last Name:</p>
        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />

        <p>Edit Email:</p>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

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
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>permanently</span>{" "}
          lose access to all of your data on your account including favourites, groups, and reviews.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("By deleting account you will lose all access to it, are you sure?")) {
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