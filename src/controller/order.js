const Order = require("../models/order");
const Product = require("../models/product");


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

        order.save()
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