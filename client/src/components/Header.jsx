import { NavLink } from "react-router-dom";
import "./Header.css";

function Header(){
    return(
        <div className="header">
            <div className="leftSpace"></div>
            <nav className="navArea">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/favorites">Favorites</NavLink>
                <NavLink to="/groups">Groups</NavLink>
                <NavLink to="/reviews">Reviews</NavLink>
            </nav>
            <div className="loginArea">
                <NavLink to="/login">Login</NavLink>
            </div>
        </div>
    );
}

export default Header;