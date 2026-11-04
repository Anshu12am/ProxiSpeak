
const roomService = require("../services/room.service");

// Create room
module.exports.createRoom = async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body);

        return res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room
        });

    } catch (err) {
        console.error("Error creating room:", err);

        if (err.message === "Room already exists") {
            return res.status(409).json({
                success: false,
                message: err.message
            });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get room
module.exports.getRoom = async (req, res) => {
    try {
        const room = await roomService.getRoom();

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: room
        });

    } catch (err) {
        console.error("Error fetching room:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update room
module.exports.updateRoom = async (req, res) => {
    try {
        const room = await roomService.updateRoom(req.body);

        return res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: room
        });

    } catch (err) {
        console.error("Error updating room:", err);

        if (err.message === "Room not found") {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};