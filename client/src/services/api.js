const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  return parseResponse(response);
};

export const loginUser = (credentials) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: credentials
  });

export const signupUser = (credentials) =>
  apiRequest("/auth/signup", {
    method: "POST",
    body: credentials
  });

export const getCurrentUser = (token) => apiRequest("/auth/me", { token });

export const getPersonalizedNews = (token) =>
  apiRequest("/news/personalized", { token });

export const getNewsArticle = (id, token) => apiRequest(`/news/${id}`, { token });
