const mongoose = require("mongoose");
const slugify = require("slugify");

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "Each book must be created by a given user"],
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Each book must have a title"],
    },
    slug: {
      type: String,
      default: function () {
        return slugify(this.title, { lower: true });
      },
    },
    genre: {
      type: String,
      trim: true,
      required: [true, "Each book must have a genre"],
    },
    author: {
      type: String,
      trim: true,
      required: [true, "Each book must have an author"],
    },
    numberOfPages: {
      type: Number,
      required: [true, "Each book must have a number of pages"],
      min: [1, "Book pages must be at least 1"],
    },
    numberOfChapters: {
      type: Number,
      required: [true, "Each book must have a number of chapters"],
      min: [1, "Book chapters must be at least 1"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: function (value) {
        return Math.round(value * 10) / 10;
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    synopsis: {
      type: String,
      trim: true,
      required: [true, "Each book must have a synopsis"],
      min: [10, "Book synopsis must be at least 40 characters long"],
    },
    myExplanation: {
      type: String,
      trim: true,
      required: [
        true,
        "Each book must include your explanation/understanding of the plot",
      ],
      min: [
        10,
        "Your explanation/understanding of the plot must be at least 40 characters long",
      ],
    },
    finalThoughts: {
      type: String,
      trim: true,
      required: [true, "Your final thought of the book is required"],
      min: [10, "Your final thoughts must be at least 40 characters long"],
    },
    recommend: {
      type: Boolean,
      required: [true, "Book recommendation is required"],
    },
    coverImage: {
      type: String,
      trim: true,
      // required: [true, "Each book must have a cover image"],
    },
    images: {
      type: [String],
      trim: true,
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

// Create a virtual property to populate the userid on the book
bookSchema.virtual("createdBy", {
  localField: "userId",
  foreignField: "_id",
  ref: "User",
});

// Use child referencing to populate the reviews on specific books
bookSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "bookId",
  ref: "Review",
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
