
import { NavLink } from "react-router-dom";
import "./Header.css";

function ManageGroupNav({ groupId }) {
  return (
    <div className="header">
     

      <nav className="nav-area">
        <NavLink
          to={`/grouppage/${groupId}`}
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Group Page
        </NavLink>
        <NavLink
          to={`/managegroup/${groupId}`}
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Manage Group
        </NavLink>
      </nav>

      
    </div>
  );
}

export default ManageGroupNav;


