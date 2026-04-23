const [rooms, setRooms] = useState({});
const [activeRoom, setActiveRoom] = useState(null);

const token = localStorage.getItem("token");

return token ? (
  <ChatPage
    rooms={rooms}
    activeRoom={activeRoom}
    setActiveRoom={setActiveRoom}
    setRooms={setRooms}
  />
) : (
  <LoginPage />
);
