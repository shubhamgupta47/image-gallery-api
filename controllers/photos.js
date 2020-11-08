const Photo = require("../models/Photo");

exports.savePhotoToDb = async (req, res) => {
  try {
    const photo = new Photo(req.body);
    const file = req.file.buffer;
    photo.photo = file;

    await photo.save();
    res.status(201).send({ _id: photo._id });
  } catch (error) {
    res.status(500).send({
      upload_error: "Error while uploading file...Try again later.",
    });
  }
};

exports.fetchPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.send(photos);
  } catch (error) {
    res.status(500).send({ get_error: "Error while getting list of photos." });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const result = await Photo.findById(req.params.id);
    res.set("Content-Type", "image/jpeg");
    res.send(result.photo);
  } catch (error) {
    res.status(400).send({ get_error: "Error while getting photo." });
  }
};
