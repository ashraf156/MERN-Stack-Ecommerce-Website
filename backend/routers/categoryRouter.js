const router = require("express").Router();
const auth = require("../middelware/auth");
const authAdmin = require("../middelware/authAdmin");

router.post(
  "/create",
 
  require("../controllers/catgoryController").createCategory,
);
router.get(
  "/getAll",
  require("../controllers/catgoryController").getAllCategories,
);
router.get(
  "/get/:id",
  require("../controllers/catgoryController").getCategoryById,
);
router.put(
  "/update/:id",
//   auth,
//   authAdmin,
  require("../controllers/catgoryController").updateCategory,
);
router.delete(
  "/delete/:id",
//   auth,
//   authAdmin,
  require("../controllers/catgoryController").deleteCategory,
);

module.exports = router;
