const Shop = require('../models/shop');
const User = require('../models/user');

exports.createShop = async (req, res) => {
    const { shopName, description } = req.body;
    const _shop = new Shop({
        owner: req.user._id,
        shopName,
        description,
    });
    const user = await User.findById(req.user._id);
    if (!user.isSeller) {
        _shop.save((err, shop) => {
            if (shop) {
                user.isSeller = true,
                user.shopId = shop._id
                user.save();
                res.status(201).json({
                    status: "Success",
                    message: "Your Shop Created"
                });
            }
            else
                res.status(400).json({
                    status: "Fail",
                    message: err
                });
        });
    }
    else {
        res.status(400).json({
            status: "Error",
            message: "You already have a Shop"
        });
    }

}