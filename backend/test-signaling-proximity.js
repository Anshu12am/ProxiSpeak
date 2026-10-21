require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/user.model");
const { getNearbyUsers } = require("./src/services/proximityService");

async function test() {
  const id = Date.now();
  const sender = "sender-" + id;
  const nearby = "nearby-" + id;
  const far = "far-" + id;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    await User.insertMany([
      { socketId: sender, location: [100, 200] },
      { socketId: nearby, location: [150, 200] },
      { socketId: far, location: [250, 200] }
    ]);

    const users = await getNearbyUsers({
      x: 100, y: 200, radius: 100,
      excludeSocketId: sender
    });

    const ids = users.map(user => user.socketId);

    console.log(ids.includes(nearby) ? "PASS: Nearby offer" : "FAIL: Nearby offer");
    console.log(!ids.includes(far) ? "PASS: Far offer blocked" : "FAIL: Far offer");

    const answers = await getNearbyUsers({
      x: 150, y: 200, radius: 100,
      excludeSocketId: nearby
    });

    const answerIds = answers.map(user => user.socketId);

    console.log(answerIds.includes(sender) ? "PASS: Answer eligible" : "FAIL: Answer eligible");
    console.log(!answerIds.includes(far) ? "PASS: Far answer blocked" : "FAIL: Far answer");

    if (!ids.includes(nearby) || ids.includes(far) ||
        !answerIds.includes(sender) || answerIds.includes(far)) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.log("Error:", err.message);
    process.exitCode = 1;
  } finally {
    await User.deleteMany({ socketId: { $in: [sender, nearby, far] } });
    await mongoose.disconnect();
    console.log("Test data cleaned up");
  }
}

test();
