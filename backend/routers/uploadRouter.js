const router = require("express").Router();
const auth = require("../middelware/auth");
const authAdmin = require("../middelware/authAdmin");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

//upload image only admin can use
router.post("/upload", (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." });
    const file = req.files.file;
    if (file?.size > 1024 * 1024) {
      removeTmp(file?.tempFilePath);
      return res.status(400).json({ msg: "Size too large." });
    }
    if (file?.mimetype !== "image/jpeg" && file?.mimetype !== "image/png") {
      removeTmp(file?.tempFilePath);
      return res.status(400).json({ msg: "File format is incorrect." });
    }
    cloudinary.uploader.upload(
      file?.tempFilePath,
      { folder: "upload" },
      async (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "Error uploading file." });
        }
        removeTmp(file?.tempFilePath);
        res.json({
          msg: "File uploaded successfully.",
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

//Delete image only admin can use
router.post("/destroy", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No images selected." });
    cloudinary.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Deleted Image" });
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.error(err);
  });
};

module.exports = router;
