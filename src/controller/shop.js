const Store = require('../models/shop');
const User = require('../models/user');

exports.createStore = async (req, res) => {
    const { storeName, about } = req.body;
    const _store = new Store({
        owner: req.user._id,
        storeName,
        about,
    });
    const user = await User.findById(req.user._id);
    if (!user.isSeller) {
        _store.save((err, store) => {
            if (store) {
                user.isSeller = true,
                user.storeId = store._id
                user.save();
                res.status(201).json({
                    status: "success",
                    message: "Your Store Created"
                });
            }
            else
                res.status(400).json({
                    status: "fail",
                    message: err.message
                });
        });
    }
    else {
        res.status(400).json({
            status: "fail",
            message: "You already have a Store."
        });
    }

}