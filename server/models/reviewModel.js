const mongoose = require("mongoose");
const Book = require("./bookModel");

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Book",
      required: [true, "Each review must be about a specific book"],
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Each review must come from a specific user"],
    },
    review: {
      type: String,
      trim: true,
      required: [true, "Each review must have a body content"],
    },
    rating: {
      type: Number,
      required: [true, "Each review must have a rating value"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.virtual("createdBy", {
  localField: "userId",
  foreignField: "_id",
  ref: "User",
});

// Create a static method to calculate ratings on tours
reviewSchema.statics.calculateRatings = async function (bookId) {
  // 1. Use aggregation pipeline to find the matching book and calculate average
  const aggregation = await Review.aggregate([
    {
      $match: { bookId },
    },
    {
      $group: {
        _id: "$bookId",
        numRatings: { $count: {} },
        ratingAvg: { $avg: "$rating" },
      },
    },
  ]);

  // 2. Update the book using its id
  await Book.findByIdAndUpdate(
    bookId,
    {
      ratingsAverage: aggregation[0]?.ratingAvg || 4.5,
      ratingsQuantity: aggregation[0]?.numRatings || 0,
    },
    { new: true, runValidators: true }
  );
};

reviewSchema.post("save", function (doc) {
  this.constructor.calculateRatings(doc.bookId);
});

reviewSchema.post(/^findOneAnd/, function (doc) {
  // this.constructor.calculateRatings(tourId);
  if (doc) {
    doc.constructor.calculateRatings(doc.bookId);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
