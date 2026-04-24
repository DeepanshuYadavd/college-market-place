import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const { logout } = useAuth();
  console.log(logout, "test");
  const navigate = useNavigate();
  useEffect(() => {
    const loggingOut = async () => {
      try {
        await logout();
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    };

    loggingOut();
  }, []);
  return <div>Logging Out...</div>;
};

export default Signout;
