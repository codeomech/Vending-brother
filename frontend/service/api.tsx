import { AdminUser } from "@/interface";

// services/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    const adminStr = localStorage.getItem("admin_user");
    if (adminStr) {
      try {
        const admin: AdminUser = JSON.parse(adminStr);
        return admin?.token;
      } catch (e) {
        // JSON parse error, kuch nahi karna
        return null;
      }
    }
  }
  return null;
};

// Helper function for API calls
const fetchAPI = async (endpoint: string, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: any = {
    "Content-Type": "application/json",
    ...(options && (options as any).headers),
  };

  // ✅ Use Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
export const createBulkInventory = async (items: any[]) => {
  const formData = new FormData();

  // Append image files
  items.forEach((item, index) => {
    formData.append("images", item.image); // 👈 image must be a File
    delete item.image; // remove before sending item metadata
  });

  // Append metadata
  formData.append("items", JSON.stringify(items));

  const token = getToken();

  const response = await fetch(`${API_URL}/inventory/bulk`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ only add this
    },
    body: formData, // ✅ browser will auto-set the content-type
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Bulk upload failed");
  }

  return await response.json();
};

export const updateInventoryItem = async (
  id: string,
  itemData: any,
  file: File
) => {
  const token = getToken();
  console.log(itemData);

  const hasFile = file instanceof File;
  console.log(hasFile);

  let body: any;
  let headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (hasFile) {
    console.log(itemData);
    // Use FormData if image is a File
    const formData = new FormData();
    if (itemData.name) formData.append("name", itemData.name);
    if (itemData.price !== undefined) formData.append("price", itemData.price);
    if (itemData.available_units !== undefined) {
      formData.append("available_units", itemData.available_units);
    }
    formData.append("image", file); // 👈 must be File
    body = formData;
  } else {
    // Use JSON if no file
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(itemData);
  }

  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Inventory update failed");
  }

  return data;
};

export const loginAdmin = (username: any, password: any) => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};
