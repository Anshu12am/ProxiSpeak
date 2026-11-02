const Room = require("../models/room.model");

// Create the predefined office
module.exports.createRoom = async (roomData) => {
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

    room.roomName = roomData.roomName ?? room.roomName;
    room.width = roomData.width ?? room.width;
    room.height = roomData.height ?? room.height;

    if (roomData.obstacles !== undefined) {
        room.obstacles = roomData.obstacles;
    }

    await room.save();

    return room;
};
