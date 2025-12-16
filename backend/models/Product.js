const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  SKU: {
    type: DataTypes.STRING,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ratings: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.JSON,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  additionalImages: {
    type: DataTypes.JSON,
  },
  specifications: {
    type: DataTypes.JSON,
  },
  variants: {
    type: DataTypes.JSON,
  },
});

module.exports = Product;
