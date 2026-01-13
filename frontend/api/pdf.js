const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get Auth headers
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// ---------------------------
// Helper: Handle fetch responses
// ---------------------------
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("Fetch response error:", error);
    throw error;
  }
};

// ---------------------------
// Upload PDF and generate study schedule
// ---------------------------
export const uploadPdfAndGenerateSchedule = async (file, days) => {
  if (!file) {
    return {
      success: false,
      message: "No file provided"
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams({ days });

    const response = await fetch(`${API_URL}/study/upload-and-schedule?${queryParams}`, {
      method: "POST",
      headers: getAuthHeaders(true), // true because multipart/form-data
      body: formData,
      credentials: "include", // send cookies if any
    });

    const data = await handleResponse(response);

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error("Upload PDF error:", error);
    return {
      success: false,
      message: error || "Something went wrong"
    };
  }
};
