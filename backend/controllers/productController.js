const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user.id,
    imageUrl: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    stockQuantity: 0,
    reviewsCount: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    imageUrl,
    brand,
    category,
    stockQuantity,
  } = req.body;

  const product = await Product.findByPk(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    product.brand = brand;
    product.category = category;
    product.stockQuantity = stockQuantity;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (product) {
    await product.destroy();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findByPk(req.params.id);

  if (product) {
    const alreadyReviewed = await Review.findOne({
      where: {
        userId: req.user.id,
        productId: product.id,
      },
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id,
      product: product.id,
    };

    const createdReview = await Review.create(review);

    const reviews = await Review.findAll({ where: { productId: product.id } });

    product.reviewsCount = reviews.length;
    product.ratings =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch flash deals
// @route   GET /api/products/flash-deals
// @access  Public
exports.getFlashDeals = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ where: { discount: { [Op.gt]: 0 } } });
  res.json(products);
});
