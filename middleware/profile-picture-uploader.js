const multer = require("multer");
const path = require("path");

// specifying the storage of the uploaded image based on the upload time & date
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/profile_pictures");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

// filter to allow only jpeg and png images to be uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format!"), false);
  }
};

const upload = multer({
  storage: storage,

  // checking the size of the image, with a limit of 24 MB
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload: upload,
};
