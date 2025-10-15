import { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import "./Myinfo.css";
import "./GroupPage.css";
import toast from "react-hot-toast";

 axios.defaults.withCredentials = true;

export default function Myinfo() {
  const { user, signin, signout } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
 
  // Hae käyttäjä backendistä
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/me`, { withCredentials: true });
        setUserData(res.data);
        setFirstname(res.data.firstname || "");
        setLastname(res.data.lastname || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
         toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const deleteUser = async () => {
    toast.custom((t) => (
      <div className={`toast-overlay ${t.visible ? "show" : "hide"}`}>
        <div className="toast-modal">
          <p>Are you sure you want to delete your account it is permanent</p>
          <div className="toast-modal-buttons">
            <button className="toast-btn cancel-btn" onClick={() => toast.dismiss(t.id)}>Cancel</button>
            <button
              className="toast-btn delete-btn"
              onClick={async () => {
                try {
                  await axios.delete(`${API_URL}/user/me`);
                  toast.success("Your profile has been deleted.");
                  await signout();
                  window.location.href = "/login";
                } catch (err) {
                  console.error("Error deleting user:", err);
                  toast.error("Failed to delete profile");
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


  if (loading) return <p>Loading user data...</p>;

  return (
  <div className="page-wrap">
    <div className="grid-container">
      {/* Left side */}
      <div className="container">
        <h3>My info</h3>
        <p><b>Email: </b> {userData?.email || "N/A"}</p>
        <p><b>First Name: </b> {userData?.firstname || "Not available"}</p>
        <p><b>Last Name: </b>{userData?.lastname || "Not available"}</p>
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
        <button className="mi-passButton" type="button">Change password</button>
      </div>

      {/* Full width bottom */}
      <div className="container full-width">
        <p>
          Note that by deleting your profile, you will{" "}
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>permanently</span>{" "}
          lose access to all of your data on your account including favourites, groups, and reviews.
        </p>
        <button
          className="mi-deleteButton"
          type="button"
          onClick={deleteUser}>
          Delete my profile
        </button>
      </div>
    </div>
    </div>
  );
}