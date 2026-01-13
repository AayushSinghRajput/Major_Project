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
    // Network error - still return success since we cleared client storage
    return {
      success: true,
      message: "Logged out successfully",
    };
  }
};

//contact route
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }
    return data;
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};

//ai routes

//helper to get the token from localstorage
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

//helper to handle fetch responses and errors
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    // If the server returns a status outside 200-299
    if (!response.ok) {
      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const sendMessage = async (prompt) => {
  const response = await fetch(`${API_URL}/ai/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      prompt,
    }),
  });
  return handleResponse(response);
};

export const sendContext = async (context, fileHash, day) => {
  const response = await fetch(`${API_URL}/ai/note`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      context,
      fileHash,
      day,
    }),
  });
  return handleResponse(response);
};

export const getUserNotes = async () => {
  const response = await fetch(`${API_URL}/ai/note`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getMCQs = async (context, fileHash, day) => {
  const response = await fetch(`${API_URL}/ai/mcqs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      context,
      fileHash,
      day,
    }),
  });
  return handleResponse(response);
};

export const getAllUserMCQs = async () => {
  const response = await fetch(`${API_URL}/ai/mcqs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const uploadBook = async (file) => {
  const formData = new FormData();
  formData.append("book", file);
  const response = await fetch(`${API_URL}/ai/upload-book`, {
    method: "POST",
    headers: getAuthHeaders(true), //true indicates multipart/form-data
    body: formData,
  });
  return handleResponse(response);
};

export const hydrateDayWithImages = async (planId, dayNum) => {
  const response = await fetch(
    `${API_URL}/ai/hydrate-day/${planId}/${dayNum}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(response);
};

export const getSavedPlans = async () => {
  const response = await fetch(`${API_URL}/ai/plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const toggleSubtopicProgress = async (planId, day, subtopicTitle) => {
  const response = await fetch(`${API_URL}/ai/toggle-progress`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      planId,
      day,
      subtopicTitle,
    }),
  });
  return handleResponse(response);
};

export const getUserStudyPlans = async () => {
  const response = await fetch(`${API_URL}/ai/user-plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getGlobalPlan = async (subject) => {
  const response = await fetch(`${API_URL}/ai/predefined-study-plan/${subject}`,{
    method:'GET',
    headers:getAuthHeaders(),
  });
  return handleResponse(response);
}

export const getMockTest = async (mock_type)=>{
  const response = await fetch(`${API_URL}/exams/${mock_type}`,{
    method:"GET",
    headers:getAuthHeaders(),
  });
  return handleResponse(response);
}

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
