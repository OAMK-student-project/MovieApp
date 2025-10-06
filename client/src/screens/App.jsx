import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
import { Toaster } from 'react-hot-toast';
//import Groupnav from "../components/Groupnav.jsx";

  export default function App() {
    
    const location = useLocation();
      
    const hideSearchOn = ["/myinfo", "/favorites"]; // muuttuja joka piilotta serch komponentin tietyllä sivulla

    return (
    <div>
      <Header/>
      
      {!hideSearchOn.includes(location.pathname) && <Search />}  
     
      <Outlet/>
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
    </div>
  );
}
