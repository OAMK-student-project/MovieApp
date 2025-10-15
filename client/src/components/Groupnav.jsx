import { NavLink } from "react-router-dom";
import "./Header.css";

function Groupnav(){
    return(
        <div className="header">
            <div className="leftSpace"></div>
            <nav className="navArea">
                
                <NavLink to="/groups"> My Groups</NavLink>
                <NavLink to="/allgroups">All groups</NavLink>
                 
            </nav>
            <div className="loginArea">
               
            </div>
        </div>
    );
}

export default Groupnav;