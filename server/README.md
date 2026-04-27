# LAN Messenger - Server

This is the backend of the LAN Messenger application built using Node.js and Express.

## Setup

```
npm install
npm start
```

## Features

* User authentication (JWT)
* Room management
* Message storage (MongoDB)
* Real-time communication (Socket.IO)

## Environment Variables

Create a `.env` file:

```
PORT=5000
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://127.0.0.1:27017/lan_messenger
```

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO
* JWT Authentication

## Notes

* Requires MongoDB running locally
* Handles API + WebSocket connections
