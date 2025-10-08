import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./screens/App.jsx";
import Home from "./screens/Home.jsx"
import Login from "./screens/account/Login.jsx";
import Signup from "./screens/account/Signup.jsx";
import Favorites from "./screens/Favorites.jsx";
import Reviews from "./screens/Reviews.jsx";
import SearchScreen from "./screens/SearchScreen";
import Theater from "./screens/Theater.jsx";
import Myinfo from "./screens/Myinfo.jsx";
import "./index.css";
import UserProvider from "./context/UserProvider.jsx";
import GroupsPage from "./screens/GroupsPage.jsx";
import ManageGroup from "./screens/ManageGroup.jsx";
import GroupPage from "./screens/GroupPage.jsx";
import SharedListPage from "./screens/FavoriteShared.jsx"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { index: true, element: <Home/> },
      { path: "login", element: <Login/> },
      { path: "favorites", element: <Favorites/>},

      { path: "groups", element: <GroupsPage /> },
      { path: "allgroups", element: <GroupsPage /> },

      { path: "/shared/favourites/:uuid", element: <SharedListPage/>},
      
      { path: "reviews", element: <Reviews/>},
      { path: "search", element: <SearchScreen/>},
      { path: "theater", element: <Theater/>},
      { path: "signup", element: <Signup/>},
      { path:"myinfo", element:<Myinfo/>},      
      { path:"grouppage/:id", element:<GroupPage/>},     
      { path:"managegroup/:id", element:<ManageGroup/>}      
     
      ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
