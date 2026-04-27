const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
      },
    );
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports = auth;
