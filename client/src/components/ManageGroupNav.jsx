
import { NavLink } from "react-router-dom";
import "./Header.css"

function ManageGroupNav({ groupId }) {
  return (
    <div className="header">
      <div className="leftSpace"></div>

      <nav className="navArea" aria-label="Group navigation">
        <NavLink
          to={`/groups/${groupId}`}
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          Group Page
        </NavLink>
        <NavLink
          to={`/groups/${groupId}/manage`}
          className={({ isActive }) => (isActive ? "active-link" : "")}>
          Manage Group
        </NavLink>
      </nav>

      <div className="loginArea">
        {/* Optional: user avatar / logout */}
      </div>
    </div>
  );
}

export default ManageGroupNav;


