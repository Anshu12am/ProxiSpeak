const mongoose = require("mongoose");

// Schema for furniture obstacles
const obstacleSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },

    x: {
        type: Number,
        required: true,
        min: 0
    },

    y: {
        type: Number,
        required: true,
        min: 0
    },

    width: {
        type: Number,
        required: true,
        min: 1
    },

    height: {
        type: Number,
        required: true,
        min: 1
    },

    blocksSound: {
        type: Boolean,
        default: true
    }
});

// Schema for the office room
const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        default: "Main Office"
    },

    width: {
        type: Number,
        required: true,
        min: 1
    },

    height: {
        type: Number,
        required: true,
        min: 1
    },

    obstacles: {
        type: [obstacleSchema],
        default: []
    }
}, {
    timestamps: true
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
