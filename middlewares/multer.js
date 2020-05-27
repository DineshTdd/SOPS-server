const multer = require('multer');

let config = {};

config.multerConfig = multer({
  //dest property is removed to store the file in User model not in filesystem.
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please upload an image!'));
    }
    callback(undefined, true);
  },
});

module.exports = config;
