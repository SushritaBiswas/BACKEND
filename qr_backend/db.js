require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("MONGODB CONNECTED");
});

mongoose.connection.on("error", (error) => {
  console.log(`Error is ${error}`);
});

module.exports = mongoose;
