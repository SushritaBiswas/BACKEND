const mongoose = require("mongoose");

const resetPassSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reset_token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, 
  },
});

module.exports = mongoose.model("Resetpass", resetPassSchema);
