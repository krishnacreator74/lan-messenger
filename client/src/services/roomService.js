import { api } from "./api";

export const getRooms = async () => {
  try {
    return await api.get("/rooms");
  } catch (err) {
    console.error("Rooms fetch failed:", err);
    return [];
  }
};