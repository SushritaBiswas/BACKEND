const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  content: {  
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  user_status: {
    type: String,
    enum: ["enable", "disable"],
    default: "enable",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("qrcode", qrSchema);
