const ScanEvent = require("../models/scanModel");
const QRCode = require("../models/qrModel");

const handleScanRedirect = async (req, res) => {
  const { qrid } = req.params;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  try {
    const qr = await QRCode.findById(qrid);
    if (!qr) return res.status(404).json({ msg: "QR not found" });

    await ScanEvent.create({
      qrCode: qrid,
      ipAddress,
      userAgent,
    });

    res.redirect(qr.link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScanStats = async (req, res) => {
  const { qrid } = req.params;

  try {
    const scans = await ScanEvent.find({ qrCode: qrid }).sort({
      scannedAt: -1,
    });

    const count = scans.length;
    const recent = scans.slice(0, 5);
    const dailyStats = {};

    scans.forEach((scan) => {
      const day = new Date(scan.scannedAt).toLocaleDateString();
      dailyStats[day] = (dailyStats[day] || 0) + 1;
    });

    res.json({
      totalScans: count,
      recentScans: recent,
      chartData: Object.entries(dailyStats).map(([date, value]) => ({
        date,
        value,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleScanRedirect,
  getScanStats,
};
