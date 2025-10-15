import { NavLink } from "react-router-dom";
import './ManageGroupNav.css';

function ManageGroupNav({ groupId }) {
  return (
    <nav className="manageGroups-navArea">
      <NavLink
        to={`/groups/${groupId}`}
        end
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        Group Page
      </NavLink>
      <NavLink
        to={`/groups/${groupId}/manage`}
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        Manage Group
      </NavLink>
    </nav>
  );
}

export default ManageGroupNav;