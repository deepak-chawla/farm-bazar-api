const router = require("express").Router();
const multer = require("multer");
const upload = require('../utils/multer');
const { updateUser, userInfo, updateUserPhoto, profile } = require("../controller/profile");
const { requireSignIn } = require('../common-middleware/');

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 'fail',
            message: err.message
        })
    }
    next();
}

router.put("/update-user", requireSignIn, updateUser);
router.get("/profile", requireSignIn, profile);
router.get("/user-info", requireSignIn, userInfo);
router.get("/user-image-upload", requireSignIn,upload.single('userImage'), errHandler,   updateUserPhoto);



module.exports = router;
