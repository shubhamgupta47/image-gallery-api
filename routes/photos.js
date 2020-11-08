const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  savePhotoToDb,
  fetchPhotos,
  getPhotoById,
} = require("../controllers/photos");

// auth middlewares
const {
  requiresSignIn,
  isAuthenticatedMiddleware,
} = require("../controllers/auth");

const upload = multer({
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(new Error("only upload files with jpg, jpeg or png format."));
    }
    cb(undefined, true); // continue with upload
  },
});

router.post(
  "/photos",
  requiresSignIn,
  isAuthenticatedMiddleware,
  upload.single("photo"),
  savePhotoToDb
);

router.get("/photos", requiresSignIn, isAuthenticatedMiddleware, fetchPhotos);

router.get("/photos/:id", getPhotoById);

module.exports = router;
