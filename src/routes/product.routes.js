const express = require("express");
const { Product } = require("../../models/index");
const { where } = require("sequelize");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description, color, price, qty, image_url } = req.body;
  console.log("req body", req.body);

  const savedProduct = await Product.create({
    name,
    description,
    color,
    price,
    qty,
    image_url,
  });

  return res.json({
    message: "Create product successfully",
    data: savedProduct,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.json({
      message: `Product id=${id} not found`,
    });
  }
  return res.json({
    message: `Get product id=${id} successfully`,
    data: product,
  });
});

router.get("/", async (req, res) => {
  const products = await Product.findAll({
    order: [["id", "ASC"]],
    // order: [["createdAt", "DESC"]],
  });
  return res.json({
    message: `Get product successfully`,
    data: products,
  });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description, color, price, qty } = req.body;

  let product = await Product.findByPk(id);
  if (!product) {
    return res.json({
      message: `Updated id=${id} not found`,
    });
  }

  await Product.update(
    {
      name,
      description,
      color,
      price,
      qty,
    },
    { where: { id } },
  );
  product = await Product.findByPk(id);

  return res.json({
    message: `Update product id=${id} successfully`,
    data: product,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let product = await Product.findByPk(id);
  if (!product) {
    return res.json({
      message: `Updated id=${id} not found`,
    });
  }

  await Product.destroy({ where: { id } });

  return res.json({
    message: `Delete product id=${id} successfully`,
    data: { id },
  });
});

module.exports = router;
