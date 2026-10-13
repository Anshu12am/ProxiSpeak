
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

async function testGeospatial() {
  const ids = [
    "geo-test-user-A",
    "geo-test-user-B",
    "geo-test-user-C",
  ];

  try {
    await mongoose.connect(process.env.MONGO_URL);

    // Clean up only our uniquely named test records
    await User.deleteMany({ socketId: { $in: ids } });

    await User.insertMany([
      { socketId: ids[0], location: [100, 100] },
      { socketId: ids[1], location: [150, 100] },
      { socketId: ids[2], location: [500, 500] },
    ]);

    const nearUsers = await User.find({
      socketId: { $in: ids },
      location: {
        $near: [100, 100],
        $maxDistance: 100,
      },
    });

    const withinUsers = await User.find({
      socketId: { $in: ids },
      location: {
        $geoWithin: {
          $center: [[100, 100], 100],
        },
      },
    });

    for (const [name, users] of [
      ["$near", nearUsers],
      ["$geoWithin", withinUsers],
    ]) {
      const found = users.map(user => user.socketId).sort();
      const expected = [ids[0], ids[1]].sort();

      const passed =
        JSON.stringify(found) === JSON.stringify(expected);

      console.log(`${name}: ${passed ? "PASS" : "FAIL"}`, found);
    }
  } catch (err) {
    console.error("Geospatial test error:", err.message);
  } finally {
    await User.deleteMany({ socketId: { $in: ids } }).catch(console.error);
    await mongoose.disconnect();
  }
}

testGeospatial();
