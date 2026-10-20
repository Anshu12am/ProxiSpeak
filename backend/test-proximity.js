
require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./src/models/user.model");
const { getNearbyUsers } = require("./src/services/proximityService");

async function testProximity() {
  const testId = "test-" + Date.now();

  const testUsers = [
    testId + "-me",
    testId + "-99",
    testId + "-100",
    testId + "-101"
  ];

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");

    // Test 1: Invalid radius
    try {
      await getNearbyUsers({ x: 100, y: 200, radius: 0 });
      console.log("Invalid input test FAILED");
    } catch (error) {
      if (error.message === "Invalid coordinates or radius") {
        console.log("Invalid input test PASSED");
      } else {
        throw error;
      }
    }

    // Test 2: Add test users
    await User.insertMany([
      { socketId: testUsers[0], location: [100, 200] },
      { socketId: testUsers[1], location: [199, 200] },
      { socketId: testUsers[2], location: [200, 200] },
      { socketId: testUsers[3], location: [201, 200] }
    ]);

    // Find nearby users
    const nearbyUsers = await getNearbyUsers({
      x: 100,
      y: 200,
      radius: 100,
      excludeSocketId: testUsers[0]
    });

    const userIds = nearbyUsers.map(user => user.socketId);

    // Check users at different distances
    if (userIds.includes(testUsers[1])) {
      console.log("99-unit user test PASSED");
    } else {
      console.log("99-unit user test FAILED");
    }

    if (userIds.includes(testUsers[2])) {
      console.log("100-unit user test PASSED");
    } else {
      console.log("100-unit user test FAILED");
    }

    if (!userIds.includes(testUsers[3])) {
      console.log("101-unit user test PASSED");
    } else {
      console.log("101-unit user test FAILED");
    }

    if (!userIds.includes(testUsers[0])) {
      console.log("Exclude current user test PASSED");
    } else {
      console.log("Exclude current user test FAILED");
    }

  } catch (error) {
    console.log("Test error:", error.message);
    process.exitCode = 1;

  } finally {
    try {
      await User.deleteMany({
        socketId: { $in: testUsers }
      });
      console.log("Test data cleaned up");
    } catch (error) {
      console.log("Cleanup error:", error.message);
      process.exitCode = 1;
    }

    await mongoose.disconnect();
  }
}

testProximity();
