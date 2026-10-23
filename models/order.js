"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      orderNumber: DataTypes.STRING,
      total: DataTypes.DECIMAL(10, 2),
      discount: DataTypes.DECIMAL(10, 2),
      orderDate: DataTypes.DATE,
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    },
  );
  return Order;
};