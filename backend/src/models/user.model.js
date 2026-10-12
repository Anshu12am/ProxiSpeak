const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      required: true,
      unique: true,
    },
  
    location:{
      type:[Number],
      required: true,
      default: [0, 0],
    }

  },
   {
    timestamps: true,
  }
);

userSchema.index(
  { location: "2d" },
  { min: 0, max: 10000 }
);

const User = mongoose.model("User", userSchema);

module.exports = User;