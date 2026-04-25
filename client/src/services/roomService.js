const API = process.env.REACT_APP_API;

export const getRooms = async () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    console.error("No valid token found");
    return [];
  }

  const res = await fetch(`${API}/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Rooms API error:", text);
    return [];
  }

  return res.json();
};