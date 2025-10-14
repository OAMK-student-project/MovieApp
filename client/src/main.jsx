import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./screens/App.jsx";
import Home from "./screens/Home.jsx";
import Login from "./screens/account/Login.jsx";
import Signup from "./screens/account/Signup.jsx";
import Favorites from "./screens/Favorites.jsx";
import Reviews from "./screens/Reviews.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import Theater from "./screens/Theater.jsx";
import Myinfo from "./screens/Myinfo.jsx";
import GroupsPage from "./screens/GroupsPage.jsx";
import Group from "./screens/Group.jsx"; // wrapper with ManageGroupNav
import GroupPage from "./screens/GroupPage.jsx";
import ManageGroup from "./screens/ManageGroup.jsx";
import SharedListPage from "./screens/FavoriteShared.jsx";
import "./index.css";
import UserProvider from "./context/UserProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "favorites", element: <Favorites /> },
      { path: "reviews", element: <Reviews /> },
      { path: "search", element: <SearchScreen /> },
      { path: "theater", element: <Theater /> },
      { path: "myinfo", element: <Myinfo /> },
      { path: "groups", element: <GroupsPage /> },
      { path: "allgroups", element: <GroupsPage /> },
      { path: "shared/favourites/:uuid", element: <SharedListPage /> },

      // Nested routes for a single group
      {
        path: "groups/:id",
        element: <Group />, // wrapper component with ManageGroupNav
        children: [
          { index: true, element: <GroupPage /> },      // /groups/:id
          { path: "manage", element: <ManageGroup /> }  // /groups/:id/manage
        ]
      }
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
