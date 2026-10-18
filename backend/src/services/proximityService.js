const User = require("../models/user.model");

module.exports.getNearbyUsers = async({x,y,radius=100,excludeSocketId = null,}) => {
   if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(radius) ||
    radius <= 0
  ) {
    throw new Error("Invalid coordinates or radius");
  }

  const query = {
  location: {
    $near: [x, y],
    $maxDistance: radius,
  },
};

  if (excludeSocketId) {
    query.socketId = { $ne: excludeSocketId };
  }

  const nearbyUsers = await User.find(query)
    .select("socketId location")
    .lean();

   return nearbyUsers.map((user) => ({
    socketId: user.socketId,
    x: user.location[0],
    y: user.location[1],
  }));
}