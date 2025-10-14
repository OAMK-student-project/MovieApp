import { NavLink } from "react-router-dom";
import './Groupnav.css'

function Groupnav(){
    return(
        <div>
            <div className="leftSpace"></div>
            <nav className="groups-navArea">
                
                <NavLink to="/groups"> My Groups</NavLink>
                <NavLink to="/allgroups">All groups</NavLink>
                 
            </nav>
            <div className="loginArea">
               
            </div>
        </div>
    );
}

export default Groupnav;