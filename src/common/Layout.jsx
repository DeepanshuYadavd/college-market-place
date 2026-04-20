import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from "@mui/icons-material/Chat";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";

const NAVIGATION = [
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <CategoryIcon />,
  },
  {
    segment: "wishlist",
    title: "Wishlist",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <BookmarksIcon />,
  },
  {
    segment: "chats",
    title: "Chats",
    icon: <ChatIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "my-listing",
    title: "My Listing",
    icon: <FormatListBulletedIcon />,
  },
  {
    segment: "signup",
    title: "Register",
    icon: <HowToRegIcon />,
  },
];

function ThemedToast() {
  const theme = useTheme();
  return <ToastContainer theme={theme.palette.mode} position="top-center" autoClose={3000} />;
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{ title: "Campus Market Place", logo: <></> }}
    >
      <ThemedToast />
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
