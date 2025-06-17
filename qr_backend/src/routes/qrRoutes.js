const express = require("express");
const router = express.Router();
const verifyToken = require("../service/authentication");
const {
  addQR,
  getQR,
  deleteQR,
  editQR,
} = require("../controllers/qrController");
const {
  handleScanRedirect,
  getScanStats,
} = require("../controllers/scanController");

router.post("/add", verifyToken, addQR);
router.get("/get", verifyToken, getQR);
router.delete("/deleteqr/:qrid", verifyToken, deleteQR);
router.post("/editqr/:qrid", verifyToken, editQR);

router.get("/scan/:qrid", handleScanRedirect);
router.get("/scan/stats/:qrid", verifyToken, getScanStats);

module.exports = router;
