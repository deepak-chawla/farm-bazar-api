const router = require("express").Router();
const upload = require("../utils/multer");
const { updateUser, userInfo, updateUserPhoto, profile } = require("../controller/profile");
const {requireSignIn} = require('../common-middleware/');


router.put("/update-user", requireSignIn, updateUser);
router.get("/profile", requireSignIn, profile);
router.get("/user-info", requireSignIn, userInfo);
router.put("/user-image-upload", requireSignIn, upload.single("userImage"), updateUserPhoto);



module.exports = router;
  