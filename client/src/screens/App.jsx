import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Search from "../components/Search.jsx";
import Theater from "./Theater.jsx";


export default function App() {
  return (
    <div>
      <Header/>
      <Search/>
      <Outlet/>
    
    </div>
  );
}
