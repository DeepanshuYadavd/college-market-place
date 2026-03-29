import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Chats from "./pages/Chats";
import MyListing from "./pages/MyListing";
import Signup from "./pages/auth/Signup";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
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
        {
          path: "/signup",
          element: <Signup />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
