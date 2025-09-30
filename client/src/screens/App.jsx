import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
//import Groupnav from "../components/Groupnav.jsx";

  export default function App() {
    
    const location = useLocation();
      
    const hideSearchOn = ["/myinfo", "/grouppage", "/managegroup"]; // muuttuja joka piilotta serch komponentin tietyillä sivuilla

    return (
    <div>
      <Header/>
      
     {!hideSearchOn.some(path => location.pathname.startsWith(path)) && <Search />}
     
      <Outlet/>
      
    </div>
  );
}
