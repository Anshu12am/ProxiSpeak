const User = require("../models/user.model");
const { getNearbyUsers } = require("../services/proximityService");

module.exports.registerMovementHandlers = (io) => {
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

  console.log(
    `Player ${socket.id} moved to (${x}, ${y}); notified ${nearbyUsers.length} nearby users`
  );
} catch (err) {
  console.error("Error finding nearby users:", err);
}


    socket.on("disconnect", async () => {
      try {
        await User.findOneAndDelete({ socketId: socket.id });
        console.log(
          `User ${socket.id} disconnected and removed from database`
        );
      } catch (err) {
        console.error("Error removing user from database:", err);
      }

      // Notify other connected players
      socket.broadcast.emit("player:left", {
        socketId: socket.id,
      });
    });
  });
});
}
