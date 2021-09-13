const express = require("express");
const { createCategory, getCategories, updateCategories, deleteCategories } = require("../controller/category");
const { requireSignIn } = require("../common-middleware");

const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/category/create", requireSignIn, upload.single("categoryImage"), createCategory);
router.get("/category/getCategory", getCategories);
router.post("/category/update", requireSignIn,  upload.array("categoryImage"),  updateCategories);
router.post("/category/delete",  requireSignIn,  deleteCategories);

module.exports = router;