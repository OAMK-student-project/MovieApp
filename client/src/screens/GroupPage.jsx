import React from 'react'
import ManageGroup from "./ManageGroup";
import { Link } from "react-router-dom";
export default function GroupPage() {
  return (
    <>
    <div><h2>GroupPage</h2>

    <h3>Group name</h3>

       <Link to="/managegroup/1"><h4>Go to Manage Group</h4></Link>
    
    
    
    </div>
  
    </>
  )
}
