
import { Outlet, useParams } from "react-router-dom";
import ManageGroupNav from "../components/ManageGroupNav";

export default function Group() {
  const { id } = useParams();

  return (
    <div className="group-wrapper">
      <ManageGroupNav groupId={id} />
      <Outlet /> {/* Renders either GroupPage or ManageGroup */}
    </div>
  );
}