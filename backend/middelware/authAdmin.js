const user = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userData = await user.findById(userId);
    if (userData.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authAdmin;
