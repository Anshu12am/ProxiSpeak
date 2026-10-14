
require("dotenv").config();

const { io } = require("socket.io-client");
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

async function testDisconnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const sender = io("http://localhost:3000");
    const receiver = io("http://localhost:3000");

    // Wait for both clients to connect
    await Promise.all([
      new Promise(resolve => sender.on("connect", resolve)),
      new Promise(resolve => receiver.on("connect", resolve))
    ]);

    console.log("Both clients connected");

    const senderId = sender.id;

    // Receiver listens for the disconnect event
    receiver.on("player:left", async (data) => {
      console.log("Received player:left:", data);

      const user = await User.findOne({ socketId: senderId });

      if (!user) {
        console.log("PASS: User removed from database");
      } else {
        console.log("FAIL: User still exists in database");
      }

      receiver.disconnect();
      await mongoose.disconnect();
    });

    // Save sender's location, then disconnect
    sender.emit("player:move", { x: 100, y: 200 });

    setTimeout(() => {
      sender.disconnect();
    }, 1000);

  } catch (err) {
    console.error("Test error:", err.message);
    await mongoose.disconnect();
  }
}

testDisconnect();
