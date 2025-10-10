import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ManageGroupNav from "../components/ManageGroupNav";
import GroupPage from "./GroupPage";
import ManageGroup from "./ManageGroup";

export default function Group() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isManageView = location.pathname.includes("managegroup");

  return (
    <div className="group-wrapper">
      <ManageGroupNav
        groupId={id}
        onSwitchView={(target) =>
          navigate(target === "manage" ? `/managegroup/${id}` : `/grouppage/${id}`)
        }
      />
      {isManageView ? <ManageGroup /> : <GroupPage />}
    </div>
  );
}