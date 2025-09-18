import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";


  export default function App() {
    
    const location = useLocation();
      
    const hideSearchOn = ["/myinfo"]; // muuttuja joka piilotta serch komponentin tietyllä sivulla

    return (
    <div>
      <Header/>
      {!hideSearchOn.includes(location.pathname) && <Search />}  
     
      <Outlet/>
      
    </div>
  );
}
