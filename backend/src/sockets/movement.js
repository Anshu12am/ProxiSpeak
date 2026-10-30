const User = require("../models/user.model");
const { getNearbyUsers } = require("../services/proximityService");

module.exports.registerMovementHandlers = (io) => {
    // Last successfully processed position for each socket
  const lastPositions = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("player:move", async (data) => {
      const { x, y } = data || {};

      // Validate coordinates
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
      ) {
        return;
      }

     const previous = lastPositions.get(socket.id);

      if (previous && previous.x === x && previous.y === y) {
        console.log("Unchanged position skipped:", socket.id);
        return;
      }

      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            $set: {
              location: [x, y],
            },
          },
          {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
          }
        );
      } catch (err) {
        console.error("Error updating user position:", err);
        return;
      }

      

try {
  const nearbyUsers = await getNearbyUsers({
    x,
    y,
    radius: 100,
    excludeSocketId: socket.id,
  });

  for (const user of nearbyUsers) {
    io.to(user.socketId).emit("player:moved", {
      socketId: socket.id,
      location: { x, y },
    });
  }

  lastPositions.set(socket.id, { x, y });

  console.log(
    `Player ${socket.id} moved to (${x}, ${y}); notified ${nearbyUsers.length} nearby users`
  );
} catch (err) {
  console.error("Error finding nearby users:", err);
}
});

    socket.on("disconnect", async () => {
      lastPositions.delete(socket.id);
      try {
    const deletedUser = await User.findOneAndDelete({
        socketId: socket.id
    });

    if (deletedUser) {
        console.log("User removed from database:", socket.id);
    } else {
        console.log("No database record found for:", socket.id);
    }
} catch (err) {
    console.error("Error removing user from database:", err);
}

      // Notify other connected players
      socket.broadcast.emit("player:left", {
        socketId: socket.id,
      });
    });
  });

}
