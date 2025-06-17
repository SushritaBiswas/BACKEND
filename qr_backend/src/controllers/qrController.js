const { Await } = require("react-router-dom");
const qrCode = require("../models/qrModel");

const addQR = async (req, res) => {
  const link = req.body.link;
  const color = req.body.color;
  const user = req.user.id;

  try {
    const newQR = new qrCode({
      link,
      color,
      user,
    });

    const saveQR = await newQR.save();
    res.json(saveQR);
  } catch (error) {
    res.json({ Error: error });
  }
};

const getQR = async (req, res) => {
  try {
    const qrlinks = await qrCode.find({ user: req.user.id });
    res.json(qrlinks);
  } catch (error) {
    res.json({ error: error });
  }
};

const deleteQR = async (req, res) => {
  const { qrid } = req.params;
  try {
    const deleteqr = await qrCode.findOneAndDelete({
      _id: qrid,
      user: req.user.id,
    });
    if (deleteqr) {
      res.json({ msg: "QR deleted" });
    } else {
      res.status(404).json({ msg: "QR not found or unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const editQR = async (req, res) => {
  const { qrid } = req.params;
  const { link, color } = req.body;

  try {
    const updateQr = await qrCode.findByIdAndUpdate(
      qrid,
      { link, color },
      { new: true }
    );

    res.json(updateQr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addQR,
  getQR,
  deleteQR,
  editQR,
};
