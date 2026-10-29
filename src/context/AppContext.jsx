import api from "@/config/api";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";

const AppContext = createContext();
const getErrorMsg = (err, fallback) => err.response?.data?.error || fallback;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const authAction = async (reqFn, successMsg, errorFallback) => {
    try {
      const { data } = await reqFn();
      setUser(data.user);

      if (successMsg) toast.success(successMsg);

      return true;
    } catch (error) {
      toast.error(getErrorMsg(error, errorFallback));

      return false;
    }
  };

  const login = (email, password) => {
    return authAction(
      () => api.post("/api/auth/login", { email, password }),
      "Welcome back!",
      "Login failed",
    );
  };

  const register = (name, email, password) => {
    return authAction(
      () => api.post("/api/auth/register", { name, email, password }),
      "Account created successfully!",
      "Registration failed",
    );
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
      setUser(null)
      toast.success("Logged out")
    } catch (error) {
      toast.error("Logout error")
    }
  }

  const value = {
    user, setUser, login, register, logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
