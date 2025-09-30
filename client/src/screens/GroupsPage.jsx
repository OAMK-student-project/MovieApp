import { useLocation } from "react-router-dom";
import Groupnav from "../components/Groupnav";
import AllGroups from "./AllGroups";
import MyGroups from "./MyGroups.jsx";

export default function GroupsPage() {
  const location = useLocation();
  const isAllGroups = location.pathname.includes("allgroups");

  return (
    <>
      <Groupnav /> {/* Navigointi all groups my groups */}
      <div className="groups-content">
        <h2>{isAllGroups}</h2>
        {isAllGroups ? <AllGroups /> : <MyGroups />}
      </div>
    </>
  );
}