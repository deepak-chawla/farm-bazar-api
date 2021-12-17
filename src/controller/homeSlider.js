const HomeSlider = require('../models/homeSlider')
const cloudinary = require('../utils/cloudinary')

exports.addSlide = async (req, res) => {
  const { productName } = req.body
  const slide = req.file
  if (productName && slide) {
    try {
      const result = await cloudinary.uploader.upload(slide.path, {
        folder: 'slides/',
      })

      const homeSlide = new HomeSlider({
        productName,
        slideImage: result.secure_url,
        cloudinary_id: result.public_id,
      })

      homeSlide
        .save()
        .then((result) =>
          res.status(200).json({
            status: 'success',
            message: `${result.productName} Slide Added.`,
          })
        )
        .catch((error) =>
          res.status(400).json({ status: 'fail', message: error.message })
        )
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message })
    }
  }
}
