
const Room = require("../models/room.model");

// Validate obstacle boundaries
module.exports.validateObstacles = (obstacles, roomWidth, roomHeight) => {

    if (!Array.isArray(obstacles)) {
        throw new Error("Obstacles must be an array");
    }

    if (!Number.isFinite(roomWidth) || roomWidth <= 0 ||
        !Number.isFinite(roomHeight) || roomHeight <= 0) {
        throw new Error("Invalid room dimensions");
    }

    for (const obstacle of obstacles) {

         if (!obstacle || typeof obstacle !== "object") {
            throw new Error("Invalid obstacle");
        }

        // Check coordinates and dimensions
        if (!Number.isFinite(obstacle.x) || obstacle.x < 0 ||
            !Number.isFinite(obstacle.y) || obstacle.y < 0 ||
            !Number.isFinite(obstacle.width) || obstacle.width <= 0 ||
            !Number.isFinite(obstacle.height) || obstacle.height <= 0) {

            throw new Error("Invalid obstacle coordinates or dimensions");
        }

        if (obstacle.x + obstacle.width > roomWidth) {
            throw new Error(
                "Obstacle exceeds room width boundary"
            );
        }

        if (obstacle.y + obstacle.height > roomHeight) {
            throw new Error(
                "Obstacle exceeds room height boundary"
            );
        }
    }

    return true;
};

// Create the predefined office
module.exports.createRoom = async (roomData) => {

    module.exports.validateObstacles(
        roomData.obstacles || [],
        roomData.width,
        roomData.height
    );

    const existingRoom = await Room.findOne();

    if (existingRoom) {
        throw new Error("Room already exists");
    }

    const room = await Room.create(roomData);

    return room;
};

// Get the saved office
module.exports.getRoom = async () => {

    const room = await Room.findOne();

    return room;
};

// Update the office layout
module.exports.updateRoom = async (roomData) => {

    const room = await Room.findOne();

    if (!room) {
        throw new Error("Room not found");
    }

    const newWidth = roomData.width ?? room.width;
    const newHeight = roomData.height ?? room.height;
    const newObstacles = roomData.obstacles ?? room.obstacles;

    module.exports.validateObstacles(
        newObstacles,
        newWidth,
        newHeight
    );

    room.roomName = roomData.roomName ?? room.roomName;
    room.width = newWidth;
    room.height = newHeight;
    room.obstacles = newObstacles;

    await room.save();

    return room;
};
