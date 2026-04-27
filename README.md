# LAN Messenger

A real-time messaging application designed for communication within a Local Area Network (LAN).

## Overview

LAN Messenger allows users to create rooms, send messages, and communicate in real time using WebSockets. It works entirely within a LAN environment without requiring external internet services.

## Features

* User authentication (Login / Signup)
* Create and join chat rooms
* Real-time messaging using Socket.IO
* Persistent message storage (MongoDB)
* Audio message support
* Responsive UI

## Tech Stack

### Frontend

* React.js
* Socket.IO Client
* CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB (Mongoose)
* JWT Authentication

## Project Structure

```
client/    # React frontend
server/    # Node.js backend
```

## Setup

### Backend

```
cd server
npm install
npm start
```

### Frontend

```
cd client
npm install
npm start
```

## Environment Variables

### Backend (.env)

```
PORT=5000
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://127.0.0.1:27017/lan_messenger
```

### Frontend (.env)

```
REACT_APP_API=http://localhost:5000
```

## Notes

* Designed for LAN usage
* Backend must run before frontend
* Uses WebSockets for real-time communication
