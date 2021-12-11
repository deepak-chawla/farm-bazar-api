const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");


exports.addOrder = async (req, res) => {
    const { quantity, address } = req.body;
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        const order = new Order({
            orderId: Date.now(),
            buyerId: req.user._id,
            storeId: product.storeId,
            productId: productId,
            orderQuantity: quantity,
            orderAddress: address,
            totalPrice: product.price * quantity
        });
        await order.save()
            .then(order => {
                res.status(201).json({
                    status: 'success',
                    message: `#${order.orderId} Order has been placed`,
                    order: order
                });
            }
            ).catch(error => res.status(400).json({ status: 'fail', message: error.message }));
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}

exports.getStoreOrdersByStatus = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id });
        const storeId = user.storeId;
        let { page, size, status } = req.query;
        if (!page) { page = 1; }
        if (!size) { size = 10; }
        const limit = parseInt(size);
        const skip = (page - 1) * size;

        await Order.find({
            $and: [
                { storeId: storeId },
                status ? { orderStatus: status } : {}
            ]
        })
            .limit(limit).skip(skip)
            .then(orders => {
                res.status(200).json(orders.length > 0 ? { orders: orders } : "No Order");
            })
            .catch(error => {
                res.status(400).json({ status: 'fail', message: error.message });
            })
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
}


exports.changeOrderStatusById = async (req, res) => {
    const { orderId, status } = req.query;
    if (orderId && status) {
        try {
            const order = await Order.findById({ _id: orderId });
            order.orderStatus = status;
            order.save((err) => {
                if (err) {
                    res.status(400).json({ status: 'fail', message: err.message })
                } else {
                    res.status(200).json({ status: 'success', message: "Status Changed." })
                }
            })
        } catch (error) {
            res.status(400).json({ status: 'fail', message: error.message })
        }
    } else {
        res.status(400).json({ status: 'fail', message: 'orderId and status required' });
    }
}