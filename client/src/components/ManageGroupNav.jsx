import { NavLink } from "react-router-dom";
import './ManageGroupNav.css';

function ManageGroupNav({ groupId }) {
  return (
    <nav className="manageGroups-navArea">
      <NavLink
        to={`/grouppage/${groupId}`}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Group Page
      </NavLink>
      <NavLink
        to={`/managegroup/${groupId}`}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Manage Group
      </NavLink>
    </nav>
  );
}

export default ManageGroupNav;