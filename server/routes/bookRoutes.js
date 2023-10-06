// IMPORT EXPRESS TO CREATE ROUTERS
const express = require("express");

// IMPORT BOOKCONTROLLER
const bookController = require("../controllers/bookController");

// IMPORT AUTH CONTROLLER
const authController = require("../controllers/authController");

const reviewController = require("../controllers/reviewController");

// IMPORT REVIEW ROUTER
const reviewRouter = require("../routes/reviewRouter");

const factoryFn = require("../controllers/factoryFn");

const Book = require("../models/bookModel");

const router = express.Router();

router.use(authController.isLoggedIn);

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(
    authController.protect,
    authController.restrictTo("user", "admin", "moderator"),
    bookController.uploadBookImages,
    bookController.processBookImages,
    bookController.createBook
  );

router.use(authController.protect);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(
    factoryFn.compareId(Book, reviewController.compareUserId),
    bookController.uploadBookImages,
    bookController.processBookImages,
    bookController.updateBook
  ) // Make in such a way that only the creator can update the book they created
  .delete(
    authController.restrictTo("user", "moderator", "admin"), // Make that admin and moderator can delete any books, but users can only delete the book they created
    factoryFn.compareId(Book, reviewController.compareUserId),
    bookController.deleteBook
  );

router.use("/:bookId/reviews", reviewRouter);

module.exports = router;
