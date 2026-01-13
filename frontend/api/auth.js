const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";


//auth routes
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
};

export const logoutUser = async () => {
  // Clear client storage immediately
  clearClientStorage();

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }
};

const clearClientStorage = () => {
  // Clear cookies
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};