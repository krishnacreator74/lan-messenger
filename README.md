💬 LAN Messenger

A simple real-time messaging app that works over Local Area Network (LAN).

Built for fast internal communication without internet dependency.

🚀 Features (Currently Implemented)
✅ Real-Time Messaging

WebSocket-based communication

Instant message updates

Server-mediated chat system

✅ Chat Rooms

Multiple rooms supported

Switch between rooms using sidebar

Active room highlighting

Room-based message separation

✅ Responsive UI

Sidebar with room list

Chat window with message display

Toggle sidebar visibility

Clean layout structure

✅ Basic State Management

Tracks active room

Updates room messages dynamically

Maintains chat state across components

🏗 Project Structure
lan-messenger/
│
├── client/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ChatWindow.jsx
│   │   └── MessageBubble.jsx
│   └── pages/
│       └── ChatPage.jsx
│
└── server/
    └── WebSocket server
⚙️ Tech Stack

Frontend

React

WebSocket

Functional components + hooks

Backend

Node.js

WebSocket (Socket.io / ws)

🧠 How It Works

Client connects to LAN WebSocket server.

User selects a room.

Messages are sent to server.

Server broadcasts message to clients in that room.

UI updates instantly.

▶️ Running the Project
1️⃣ Clone the repository
git clone https://github.com/your-username/lan-messenger.git
cd lan-messenger
2️⃣ Install dependencies
npm install
3️⃣ Start the server
npm run server
4️⃣ Start the client
npm run client

Make sure devices are connected to the same LAN network.
