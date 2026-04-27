const API = process.env.REACT_APP_API;

// =========================
// BASE REQUEST
// =========================
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", text);
    throw new Error(text);
  }

  return res.json();
};

// =========================
// METHODS
// =========================
export const api = {
  get: (url) => request(url),
  post: (url, data) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};