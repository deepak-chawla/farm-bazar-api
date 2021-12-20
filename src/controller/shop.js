const { addStr } = require('../helpers')
const Store = require('../models/shop')
const User = require('../models/user')

exports.createStore = async (req, res) => {
  const { storeName, about } = req.body
  const _store = new Store({
    owner: req.user._id,
    storeName,
    about,
  })
  const user = await User.findById(req.user._id)
  if (!user.isSeller) {
    _store.save((err, store) => {
      if (store) {
        ;(user.isSeller = true), (user.storeId = store._id)
        user.save()
        res.status(201).json({
          status: 'success',
          message: 'Your Store Created',
        })
      } else
        res.status(400).json({
          status: 'fail',
          message: err.message,
        })
    })
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'You already have a Store.',
    })
  }
}

exports.getStoreById = async (req, res) => {
  try {
    const { storeId } = req.params
    if (storeId) {
      const store = await Store.findById({ _id: storeId }).populate(
        'owner',
        'firstName lastName profilePicture'
      )
      res.status(200).json({
        ...store._doc,
        owner: {
          _id: store.owner._id,
          firstName: store.owner.firstName,
          lastName: store.owner.lastName,
          profilePicture: addStr(
            store.owner.profilePicture,
            49,
            'w_100,h_100,c_fill'
          ),
        },
        storeImage: addStr(store.storeImage, 49, 'w_100,h_100,c_fill'),
      })
    } else {
      res.status(400).json({ status: 'fail', message: 'StoreId Required' })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.getOwnerById = async (req, res) => {
  try {
    const { ownerId } = req.params
    if (ownerId) {
      const user = await User.findById({ _id: ownerId }).select(
        'firstName lastName profilePicture city address email contactNumber gender datOfBirth'
      )
      res.status(200).json({
        ...user._doc,
        profilePicture: addStr(user.profilePicture, 49, 'w_100,h_100,c_fill'),
      })
    } else {
      res.status(400).json({ status: 'fail', message: 'ownerId Required' })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}
