"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/auth";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //On initial mount , check if a token exists and verify the user
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getCurrentUser(token);
      if (data.success) {
        setUser(data.user);
      } else {
        //if token is invalid/expired, clear it
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data.success) {
        //Save the token for subsequent AI API calls
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token"); //clear token on logout
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
