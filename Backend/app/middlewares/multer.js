const multer = require("multer");

// Multer File upload settings
const DIR = "./public/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    let fileName = file.originalname.toLowerCase().split(" ").join("-");
    let extension = fileName.split('.')[1];
    fileName = `${fileName.split('.')[0]}-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});
// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// create a Multer middleware instance with your storage engine

// export the middleware instance
module.exports = upload;
