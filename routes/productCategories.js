const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Categories = require("../model/productCategories");
const { uploadImage, cloudnaryImageUpload } = require("../helpers");

router.get("/", (req, res) => {
  Categories.find({}, (err, result) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({ categories: result });
    }
  });
});

router.post("/", uploadImage.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No image file provided" });
  }

  try {
    const { name } = req.body;
    const image = await cloudnaryImageUpload(req);
    const rm = await Categories.create({
      name,
      image,
    });
    res.status(201).json({
      msg: "Category created successfull!",
      category: rm,
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

router.put("/", auth, (req, res) => {
  const { name, _id } = req.body;
  Categories.updateOne({ _id }, { name }, (err, result) => {
    if (err) {
      return res.status(400).send({ msg: err.message });
    } else {
      res.status(200).send({ result, msg: "Category updated successfull!" });
    }
  });
});

router.delete("/:id", auth, (req, res) => {
  const id = req.params["id"];
  Categories.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return res.status(400).send({ msg: err.message });
    } else {
      res.status(200).send({ result });
    }
  });
});

module.exports = router;
