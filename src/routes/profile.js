const router = require("express").Router();
const upload = require("../utils/multer");
const { editProfile, profile } = require("../controller/profile");
const {requireSignIn} = require('../common-middleware/');


router.put("/edit-profile", requireSignIn,  upload.single("profilePicture"), editProfile);
router.get("/profile", requireSignIn, profile);


module.exports = router;
  