import { createContext, useLayoutEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  // Ensure backend URL does not end with a slash to prevent double slashes in requests
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

  axios.defaults.withCredentials = true; // Apply globally if needed

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // ✅ Default state to `null`

  // Function to fetch authentication status
  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/is_auth`, {
        withCredentials: true, // ✅ Ensures cookies (including token) are sent automatically
      });

      if (data.success) {
        setIsLoggedin(true); // ✅ Ensure it sets true on success
        getUserData(); // ✅ Fetch user data if authenticated
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication check failed");
    }
  }, []); // ✅ Prevent infinite loop in useLayoutEffect

  // Function to fetch user data
  const getUserData = async () => {
    console.log("Fetching user data...");
    try {
      const { data } = await axios.get(`${backendUrl}/user/data`, {
        withCredentials: true, // ✅ Ensures cookies (including token) are sent automatically
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  useLayoutEffect(() => {
    getAuthState();
  }, [getAuthState])

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};

// ✅ Add PropTypes validation
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
