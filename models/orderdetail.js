'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  orderDetail.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    productPrice: DataTypes.DECIMAL,
    qty: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'orderDetail',
  });
  return orderDetail;
};