const router = require("express").Router();

const { registerUser, refreshToken } = require("../controllers/userController");

router.post("/register", registerUser);
router.get("/refresh_token", refreshToken);

module.exports = router;
