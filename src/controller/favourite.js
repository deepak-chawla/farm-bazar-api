const favourite = require('../models/favourite')
const Fav = require('../models/favourite')

exports.addToFav = async (req, res) => {
  try {
    const { productId } = req.params
    const fav = await Fav.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          favourite: {
            product: productId,
          },
        },
      }
    )
    if (fav) {
      fav.save((err, saved) => {
        if (err) {
          res.status(400).json({ status: 'fail', message: err.message })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Product successfully added to Favourite.',
          })
        }
      })
    } else {
      const _fav = new Fav({
        user: req.user._id,
        favourite: [
          {
            product: productId,
          },
        ],
      })
      _fav.save((err, saved) => {
        if (err) {
          res.status(400).json({ status: 'fail', message: err.message })
        } else {
          res.status(200).json({
            status: 'success',
            message: 'Product successfully added to Favourite.',
          })
        }
      })
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.userFav = async (req, res) => {
  try {
    const fav = await Fav.findOne({ user: req.user._id }).populate(
      'favourite.product',
      '-reviews -slug -ratings'
    )
    res.status(200).json(fav.favourite)
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.deleteFav = async (req, res) => {
  try {
    const { productId } = req.params
    let fav = await Fav.findOne({ user: req.user._id })
    for (let item of fav.favourite) {
      if (item.product._id == productId) {
        await item.remove()
      }
    }
    fav.save((err, save) => {
      res
        .status(200)
        .json({ status: 'success', message: 'Removed from Favourite' })
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}
