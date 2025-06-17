const express = require("express");
const router = express.Router();
const verifyToken = require("../service/authentication");

const {
  loginUser,
  createUser,
  getUsers,
  deleteUsers,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", verifyToken, createUser);
router.get("/", verifyToken, getUsers);
router.delete("/users/:id", verifyToken, deleteUsers);

module.exports = router;
