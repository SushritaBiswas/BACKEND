require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoDB = require("./db");

//Routers
const userRouter = require("./src/routes/userRoutes");
const qrRouter = require("./src/routes/qrRoutes");

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = process.env.PORT || 3000;

//Initializing
app.use("/", userRouter);
app.use("/", qrRouter);

app.listen(port, (req, res) => {
  console.log(`Server is running at: http://localhost:${port}`);
});
