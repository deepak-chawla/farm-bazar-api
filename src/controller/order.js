const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')
const { addStr, notifyUser } = require('../helpers/index')

exports.addOrder = async (req, res) => {
  const {
    name,
    city,
    contactNumber,
    postalCode,
    paymentOption,
    quantity,
    address,
  } = req.body
  const { productId } = req.params
  try {
    const product = await Product.findById(productId).populate(
      'createdBy',
      'fcm_token'
    )
    const order = new Order({
      orderNumber: Date.now(),
      name: name,
      city: city,
      postalCode: postalCode,
      contactNumber: contactNumber,
      orderQuantity: quantity,
      orderAddress: address,
      paymentOption: paymentOption,
      subTotal: product.price * quantity,
      totalPrice: product.price * quantity + 200,
      buyerId: req.user._id,
      storeId: product.storeId,
      productId: productId,
    })
    await order
      .save()
      .then((order) => {
        const notification = {
          title: 'New Order',
          body: `${order.name} ordered ${product.productName}`,
        }
        const data = {
          title: 'Order Detail',
          body: `${JSON.stringify(order)}`,
        }
        notifyUser(product.createdBy.fcm_token, notification, data)
        res.status(201).json({
          status: 'success',
          message: `#${order.orderNumber} Order has been placed`,
          order: order,
        })
      })
      .catch((error) =>
        res.status(400).json({ status: 'fail', message: error.message })
      )
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getStoreOrders = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id })
    const storeId = user.storeId
    let { page, size, isActive } = req.query
    if (!page) {
      page = 1
    }
    if (!size) {
      size = 10
    }
    const limit = parseInt(size)
    const skip = (page - 1) * size

    let orders = await Order.find({
      $and: [{ storeId: storeId }, isActive ? { isActive: isActive } : {}],
    })
      .populate('productId', 'productName productPictures unit price quantity')
      .limit(limit)
      .skip(skip)

    orders = orders.map((order) => {
      return {
        _id: order._id,
        isActive: order.isActive,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        productName: order.productId.productName,
        productPrice: order.productId.price,
        productQuantity: order.productId.quantity,
        productImage: addStr(
          order.productId.productPictures[0].img,
          49,
          'w_80,h_80,c_fill'
        ),
        name: order.name,
        city: order.city,
        contactNumber: order.contactNumber,
        orderAddress: order.orderAddress,
        orderQuantity: order.orderQuantity,
        unit: order.productId.unit,
        subTotal: order.subTotal,
        totalPrice: order.totalPrice,
        productId: order.productId._id,
        buyerId: order.buyerId,
        date: order.createdAt,
      }
    })
    res.status(200).json({ orders: orders })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getBuyerOrders = async (req, res) => {
  try {
    let { page, size, isActive } = req.query
    if (!page) {
      page = 1
    }
    if (!size) {
      size = 10
    }
    const limit = parseInt(size)
    const skip = (page - 1) * size

    let orders = await Order.find({
      $and: [{ buyerId: req.user._id }, isActive ? { isActive: isActive } : {}],
    })
      .populate('productId', 'productPictures productName price quantity unit')
      .limit(limit)
      .skip(skip)
    orders = orders.map((order) => {
      return {
        _id: order._id,
        isActive: order.isActive,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        productName: order.productId.productName,
        productPrice: order.productId.price,
        productQuantity: order.productId.quantity,
        productImage: addStr(
          order.productId.productPictures[0].img,
          49,
          'w_80,h_80,c_fill'
        ),
        name: order.name,
        city: order.city,
        contactNumber: order.contactNumber,
        orderAddress: order.orderAddress,
        orderQuantity: order.orderQuantity,
        unit: order.productId.unit,
        subTotal: order.subTotal,
        totalPrice: order.totalPrice,
        productId: order.productId._id,
        buyerId: order.buyerId,
        date: order.createdAt,
      }
    })
    res.status(200).json({ orders: orders })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.changeOrderStatusById = async (req, res) => {
  const { orderId, status } = req.query
  if (orderId && status) {
    try {
      const order = await Order.findById({ _id: orderId }).populate(
        'buyerId',
        'fcm_token'
      )
      if (status === 'completed') {
        order.isActive = false
      } else {
        order.isActive = true
      }
      order.orderStatus = status
      order.save((err, order) => {
        if (err) {
          res.status(400).json({ status: 'fail', message: err.message })
        } else {
          const notification = {
            title: 'Your Order Status Changed',
            body: `order ${order.orderNumber} is ${order.orderStatus}`,
          }
          const data = {
            title: 'Order Detail',
            body: `${JSON.stringify(order)}`,
          }
          notifyUser(order.buyerId.fcm_token, notification, data)
          res
            .status(200)
            .json({ status: 'success', message: 'Status Changed.' })
        }
      })
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message })
    }
  } else {
    res
      .status(400)
      .json({ status: 'fail', message: 'orderId and status required' })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById({ _id: orderId })
      .populate('storeId', 'storeImage storeName about')
      .populate(
        'productId',
        'productPictures productName price quantity unit description'
      )
    let response = {
      _id: order._id,
      isActive: order.isActive,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      productName: order.productId.productName,
      productprice: order.productId.price,
      productQuantity: order.productId.quantity,
      productImage: addStr(
        order.productId.productPictures[0].img,
        49,
        'w_80,h_80,c_fill'
      ),
      name: order.name,
      city: order.city,
      contactNumber: order.contactNumber,
      orderAddress: order.orderAddress,
      postalCode: order.postalCode,
      orderQuantity: order.orderQuantity,
      unit: order.productId.unit,
      deliveryCharges: order.deliveryCharges,
      subTotal: order.subTotal,
      totalPrice: order.totalPrice,
      storeName: order.storeId.storeName,
      storeDescription: order.storeId.aboutStore,
      storeImage: addStr(order.storeId.storeImage, 49, 'w_80,h_80,c_fill'),
      productId: order.productId._id,
      buyerId: order.buyerId,
      storeId: order.storeId._id,
      date: order.createdAt,
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (order.orderStatus == 'pending') {
      if (order.buyerId == req.user._id) {
        await order.delete()
        res
          .status(200)
          .json({ status: 'success', message: 'Order has been canceled.' })
      } else {
        res
          .status(400)
          .json({ status: 'fail', message: "BuyerID didn't match." })
      }
    } else {
      res.status(400).json({ status: 'fail', message: "You Can't Cancel now" })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
