const User = require('../models/user');

exports.editProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.address = req.body.address || user.address;
        user.contactNumber = req.body.contactNumber || user.contactNumber;
        user.profilePicture = req.file.path  || user.profilePicture;
    }
}
