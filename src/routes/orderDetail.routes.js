const express = require("express");
const { orderDetail } = require("../../models/index");
const { where } = require("sequelize");
const router = express.Router();

router.post("/", async (req, res) => {
  const { orderId, productId, productName, productPrice, qty, amount } =
    req.body;
  console.log("req body", req.body);

  const savedOrderDetail = await orderDetail.create({
    orderId,
    productId,
    productName,
    productPrice,
    qty,
    amount,
  });
  return res.json({
    message: "Create order detail successfully",
    data: savedOrderDetail,
  });
});

module.exports = router;
