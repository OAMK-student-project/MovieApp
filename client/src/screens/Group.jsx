import { useParams } from "react-router-dom";
import ManageGroupNav from "../components/ManageGroupNav";
import GroupPage from "./GroupPage";
import ManageGroupPage from "./ManageGroupPage";

export default function Group() {
  const { id } = useParams(); // group ID from URL
  const [view, setView] = useState("group"); // "group" or "manage"

  // Optionally, you can detect the URL path to set view automatically
  // const location = useLocation();
  // const view = location.pathname.includes("managegroup") ? "manage" : "group";

  return (
    <div className="group-wrapper">
      {/* Top navigation for this group */}
      <ManageGroupNav groupId={id} />

      {/* Main content depending on view */}
      {view === "group" ? <GroupPage groupId={id} /> : <ManageGroupPage groupId={id} />}
    </div>
  );
}