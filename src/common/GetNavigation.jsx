import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from "@mui/icons-material/Chat";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HowToRegIcon from "@mui/icons-material/HowToReg";

export const getNavigation = (user) => [
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
