import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/') // folder where images will be saved
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

export default upload
