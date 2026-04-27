const router = require("express").Router();
const auth = require("../middelware/auth");

const {
  registerUser,
  refreshToken,
  loginUser,
  logoutUser,
  getUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh_token", refreshToken);
router.get("/logout", logoutUser);
router.get("/infor", auth, getUser);

module.exports = router;
