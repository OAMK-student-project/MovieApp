import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
import { Toaster } from 'react-hot-toast';


  export default function App() {
    
    const location = useLocation();
      
    const hideSearchOn = ["/myinfo", "/groups","/favorites", "/managegroup"]; // muuttuja joka piilotta serch komponentin tietyillä sivuilla
   
    return (
    <div>
      <Header/>
      
     {!hideSearchOn.some(path => location.pathname.startsWith(path)) && <Search />}
     
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
