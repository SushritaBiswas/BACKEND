const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "qrcode",
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scan", scanSchema);
