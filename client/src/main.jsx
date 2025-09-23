import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./screens/App.jsx";
import Home from "./screens/Home.jsx"
import Login from "./screens/Login.jsx";
import Favorites from "./screens/Favorites.jsx";
import Groups from "./screens/Groups.jsx";
import Reviews from "./screens/Reviews.jsx";
import SearchScreen from "./screens/SearchScreen";
import Theater from "./screens/Theater.jsx";
import Myinfo from "./screens/Myinfo.jsx";
import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { index: true, element: <Home/> },
      { path: "login", element: <Login/> },
      { path: "favorites", element: <Favorites/>},
      { path: "groups", element: <Groups/>},
      { path: "reviews", element: <Reviews/>},
      { path: "search", element: <SearchScreen/>},
      { path: "theater", element: <Theater/>},
      {path:"myinfo", element:<Myinfo/>}      
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
