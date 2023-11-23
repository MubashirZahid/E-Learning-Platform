const multer = require("multer");
const path = require("path");
// const { imgType, docType } = require("../constants/fileTypes");

const uploadImage = multer({
  limits: {
    fileSize: 536870912,
  },
  // storage: multer.diskStorage({
  //   destination: (req, file, callback) => {
  //     if (file) {
  //       callback(null, "./server/images");
  //     } else {
  //       req.file.error = "No file was found";
  //       callback("No file was found", null);
  //     }
  //   },
  //   filename: (req, file, callback) => {
  //     if (file) {
  //       callback(null, Date.now() + "_" + file.originalname);
  //     } else {
  //       callback("No file was found", null);
  //     }
  //   },
  // }),
  fileFilter: (req, file, callback) => {
    if (file) {
      const extension = path.extname(file.originalname);
      req.file_extension = extension;
      if ([".jpg", ".png"].includes(extension)) {
        callback(null, true);
      } else {
        req.file.error = "No file was found";
        callback(null, false);
      }
    } else {
      callback("No file found", false);
    }
  },
});

const uploadFile = multer({
  limits: {
    fileSize: 536870912,
  },
  fileFilter: (req, file, callback) => {
    if (file) {
      const extension = path.extname(file.originalname);
      req.file_extension = extension;
      if ([".jpg", ".png", ".mp4", ".avi", ".m4a"].includes(extension)) {
        callback(null, true);
      } else {
        req.file.error = "No file was found";
        callback(null, false);
      }
    } else {
      callback("No file found", false);
    }
    // fileFilter: (req, file, callback) => {
    //   if (file) {
    //     const extension = path.extname(file.originalname);
    //     req.file_extension = extension;
    //     if (docType.includes(extension)) {
    //       callback(null, true);
    //     } else {
    //       // req.file = new multer.MulterError("Only pdfs are allowed");
    //       // callback("error occuered", false);
    //       callback(null, false);
    //     }
    //   } else {
    //     callback("No file found", false);
    //   }
    // },
    // fileFilter: (req, file, callback) => {
    //   if (file) {
    //     const extension = path.extname(file.originalname);
    //     req.file_extension = extension;
    //     if (docType.includes(extension)) {
    //       callback(null, true);
    //     } else {
    //       callback(null, false);
    //     }
    //   } else {
    //     callback("No file found", false);
    //   }
  },
});

module.exports = { uploadImage, uploadFile };
