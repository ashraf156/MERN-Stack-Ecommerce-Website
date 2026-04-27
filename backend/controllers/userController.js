const User = require("../modles/userModles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/users/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken });

    // res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = (req, res) => {
  try {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token)
      return res.status(400).json({ message: "Please login now!" });
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ message: "Please login now!" });
      const accessToken = createAccessToken({ id: user.id });
      res.json({ accessToken });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  registerUser,
  refreshToken,
};
