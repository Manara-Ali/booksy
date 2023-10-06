const express = require("express");
const Review = require("../models/reviewModel");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const factoryFn = require("../controllers/factoryFn");

const router = express.Router({ mergeParams: true });

// Protect everything reviews
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo("user"), reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    factoryFn.compareId(Review, reviewController.compareUserId),
    reviewController.updateReview
  )
  .delete(
    factoryFn.compareId(Review, reviewController.compareUserId),
    reviewController.deleteReview
  );

module.exports = router;
