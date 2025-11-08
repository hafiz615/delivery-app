import axios from "axios";

// Use direct backend URL instead of /api proxy
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints

export const signup = async (email, password, confirmPassword) => {
  console.log("API: Sending signup request to:", `${API_URL}/auth/signup`);

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    console.log("API: Response status:", response.status);

    const data = await response.json();
    console.log("API: Response data:", data);

    if (!response.ok) {
      const error = new Error(data.error || "Signup failed");
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API: Signup error:", error);
    throw error;
  }
};
export const login = async (email, password) => {
  console.log("API: Sending login request to:", `${API_URL}/auth/login`);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("API: Response status:", response.status);

    const data = await response.json();
    console.log("API: Response data:", data);

    if (!response.ok) {
      const error = new Error(data.error || "Login failed");
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API: Fetch error:", error);
    throw error;
  }
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Order endpoints
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export default api;
