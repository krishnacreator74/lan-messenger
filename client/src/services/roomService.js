const API = process.env.REACT_APP_API;

export const getRooms = async () => {
  const res = await fetch(`${API}/rooms`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
};