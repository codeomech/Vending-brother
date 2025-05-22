// services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper function for API calls
const fetchAPI = async (endpoint: string, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  // Set default headers
  // options को टाइप करें ताकि headers property एक्सिस्ट करे
  const headers = {
    "Content-Type": "application/json",
    ...(options && (options as any).headers),
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers["x-auth-token"] = token;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// Public API calls
export const getInventory = () => {
  return fetchAPI("/inventory");
};

export const buyItems = (items: any) => {
  console.log(items);
  return fetchAPI("/inventory/buy", {
    method: "POST",
    body: JSON.stringify(items),
  });
};

// Admin API calls
export const createBulkInventory = (items: any) => {
  return fetchAPI("/inventory/bulk", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
};

export const updateInventoryItem = (id: any, itemData: any) => {
  return fetchAPI(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(itemData),
  });
};

export const loginAdmin = (username: any, password: any) => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};
