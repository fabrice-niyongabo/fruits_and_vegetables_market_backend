const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const { verifyToken, getMyIp } = require("../helpers");

const Categories = require("../model/productCategories");

router.get("/", (req, res) => {
  Categories.find({}, (err, result) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send({ categories: result });
    }
  });
});

router.post("/", async (req, res) => {
  const { name, image } = req.body;
  try {
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
  const { name, id } = req.body;
  Categories.updateOne({ _id: id }, { name }, (err, result) => {
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
