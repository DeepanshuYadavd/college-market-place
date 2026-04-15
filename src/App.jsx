import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Chats from "./pages/Chats";
import MyListing from "./pages/MyListing";
import Signup from "./pages/auth/Signup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          element: <ProtectedRoute />, // Parent wrapper for protected routes
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "/products",
              element: <Products />,
            },
            {
              path: "/wishlist",
              element: <Wishlist />,
            },
            {
              path: "/orders",
              element: <Orders />,
            },
            {
              path: "/chats",
              element: <Chats />,
            },
            {
              path: "/my-listing",
              element: <MyListing />,
            },
          ],
        },
        {
          path: "/signup",
          element: <Signup />,
        },
      ],
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
