# ProxiSpeak — Backend

ProxiSpeak is a geospatial proximity audio ecosystem that enables users to move around a shared virtual space. The backend handles real-time avatar movement using Socket.IO and stores user positions in MongoDB for geospatial queries.

## Tech Stack

- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── sockets/
│       └── movement.js
├── app.js
├── server.js
├── package.json
└── .env
```

## Prerequisites

- Node.js and npm
- A MongoDB database, local or MongoDB Atlas
- Git

## Setup Instructions

1. Clone the repository and navigate to the backend directory.

   ```bash
   cd backend
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory.

   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   ```

   Replace the placeholder with your MongoDB connection string. Do not commit your `.env` file or expose database credentials.

4. Start the backend using the start script configured in `package.json`.

   ```bash
   npm start
   ```

   If no start script is configured, use the existing server entry point:

   ```bash
   node server.js
   ```

## Socket.IO Events

### Client → Server

| Event | Payload | Purpose |
|---|---|---|
| `player:move` | `{ "x": 100, "y": 200 }` | Sends the client's avatar coordinates to the server. |

The server validates that both coordinates are finite numbers before processing the movement.

### Server → Other Clients

| Event | Payload | Purpose |
|---|---|---|
| `player:moved` | `{ "socketId": "...", "location": { "x": 100, "y": 200 } }` | Notifies other connected clients about a player's new position. |
| `player:left` | `{ "socketId": "..." }` | Notifies other connected clients when a player disconnects. |

## Database

The user model stores a unique Socket.IO connection ID and the user's location as a coordinate array.

The location field supports MongoDB geospatial queries. The backend can use geospatial operations such as `$near` and `$geoWithin` to find nearby users.

## Development Notes

- Keep the MongoDB connection string private.
- Validate incoming movement coordinates.
- Test movement broadcasting and disconnect cleanup.
- Run the backend from the `backend` directory unless your scripts specify otherwise.

