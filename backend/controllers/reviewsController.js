const Review = require('../models/Review');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all reviews for a product
// @route     GET /api/v1/products/:productId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId);

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${productId}`), 404
    );
  }

  const reviews = await Review.findAll({ where: { productId } });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id, {
    include: {
      model: Product,
      attributes: ['name', 'description']
    }
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`), 404
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Add review
// @route     POST /api/v1/products/:productId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.productId = req.params.productId;
  req.body.userId = req.user.id;

  const product = await Product.findByPk(req.params.productId);

  if (!product) {
    return next(
      new ErrorResponse(`No product with the id of ${req.params.productId}`), 404
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findByPk(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`), 404
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to update review`), 401
    );
  }

  review = await review.update(req.body);

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`), 404
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to delete review`), 401
    );
  }

  await review.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});
