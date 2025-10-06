import { NavLink } from "react-router-dom";
import { useUser } from "../context/useUser";
import "./Header.css";

function Header(){
    const { user, signout } = useUser();
    const identified = Boolean(user?.identifiedUser);

    function signInOrOut(){
<<<<<<< HEAD
      return identified ? (
      <>
        <NavLink to="/myinfo">My Info</NavLink>
        <NavLink onClick={signOut} to="/">Logout</NavLink>
      </>
    ) : (
      <NavLink to="/login">Login</NavLink>
    );
  }
=======
        return identified
        ? <> 
            <NavLink to="/myinfo">To My info</NavLink>
            <NavLink onClick={signOut} className={({ isActive }) => (isActive ? "inactive" : "")}>Logout</NavLink>
        </>
        : <NavLink to="/login">Login</NavLink>;
    }
>>>>>>> origin/main

    function signOut(){
        signout();
    }


    return(
        <div className="header">
            <div className="leftSpace"></div>
            <nav className="navArea">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/favorites">Favorites</NavLink>
                <NavLink to="/groups">Groups</NavLink>
                <NavLink to="/reviews">Reviews</NavLink>
                <NavLink to="/theater">Theater</NavLink>
            </nav>
            <div className="loginArea">
                {signInOrOut()}
            </div>
        </div>
    );
}

export default Header;