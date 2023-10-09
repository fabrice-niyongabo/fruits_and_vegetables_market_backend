const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const Categories = require("../model/productCategories");

const Products = require("../model/products");
const {
  uploadImage,
  cloudnaryImageUpload,
  deleteImageFromCloudinary,
} = require("../helpers");

router.get("/", async (req, res) => {
  try {
    const products = [];
    const allProds = await Products.find({});
    for (let i = 0; i < allProds.length; i++) {
      const categoryDetails = await Categories.findOne({
        _id: allProds[i].categoryId,
      });
      products.push({ ...allProds[i]._doc, categoryDetails });
    }
    return res.status(200).send({ products });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }
});

router.post("/", auth, uploadImage.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No image file provided" });
  }
  const { name, categoryId, price, description } = req.body;
  try {
    if (!(name && categoryId && price)) {
      return res.status(400).send({ msg: "All fields are required" });
    }
    const image = await cloudnaryImageUpload(req);
    const rm = await Products.create({
      name,
      image,
      categoryId,
      price,
      description,
    });
    return res.status(201).send({
      msg: "Product added successfull!",
      product: rm,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).send({ msg: error.message });
  }
});

router.put("/", auth, (req, res) => {
  const { name, categoryId, price, description, _id } = req.body;
  Products.updateOne(
    { _id },
    { name, categoryId, price, description },
    (err, result) => {
      if (err) {
        return res.status(400).send({ msg: err.message });
      } else {
        res.status(200).send({ result, msg: "Product updated successfull!" });
      }
    }
  );
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params["id"];
    const product = await Products.findById({ _id: id });
    if (!product) {
      return res.status(400).send({ msg: "Invalid product" });
    }
    await Products.deleteOne({ _id: id });
    await deleteImageFromCloudinary(product.image?.public_id);
  } catch (error) {
    return res.status(400).send({ msg: err.message });
  }
});

module.exports = router;
