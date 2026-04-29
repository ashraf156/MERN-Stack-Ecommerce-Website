const router = require("express").Router();
const auth = require("../middelware/auth");
const authAdmin = require("../middelware/authAdmin");

const {
  createProduct,
  getAllProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.post("/create", createProduct);
router.get("/getAllProducts", getAllProduct);
router.get("/getProduct/:id", getAllProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.put("/updateProduct/:id", updateProduct);

module.exports = router;
