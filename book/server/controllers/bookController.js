const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const Book = require("../models/bookModel");
const catchAsyncFn = require("../utils/catchAsyncFn");
const ApplicationError = require("../utils/applicationError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllBooks = catchAsyncFn(async (req, res, next) => {
  // Create a new instance of an application features
  let apiFeatures = new APIFeatures(
    Book.find().populate({
      path: "createdBy",
      select: "-email",
    }),
    req.query
  );

  apiFeatures = apiFeatures.filter().sort().paginate().limit();

  // Return document by awaiting query
  const books = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
      loggedInUser: res.loggedInUser,
    },
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    const applicationError = new ApplicationError(
      "Invalid file type. Please upload and image and try again.",
      400
    );

    cb(applicationError, false);
  }
};

const multerUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBookImages = multerUpload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.processBookImages = catchAsyncFn(async (req, res, next) => {
  if (!req.files?.coverImage && !req.files?.images) {
    next();
    return;
  }

  // 1. Process Cover image
  const coverImageFilename = `books-${req.user.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .withMetadata()
    .toFile(
      path.join(
        `${__dirname}/../../client`,
        `public/img/books/${coverImageFilename}`
      )
    );

  req.body.coverImage = coverImageFilename;

  // 2. Process array
  req.body.images = [];

  const promiseArr = req.files.images.map(async (element, index) => {
    const filename = `books-${req.user.id}-${Date.now()}-${index + 1}.jpeg`;

    await sharp(element.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .withMetadata()
      .toFile(
        path.join(`${__dirname}/../../client`, `public/img/books/${filename}`)
      );

    return req.body.images.push(filename);
  });

  await Promise.all(promiseArr);

  next();
});

exports.createBook = catchAsyncFn(async (req, res, next) => {
  // Add the user to the create book request
  req.body.userId = req.user._id;

  console.log(req.body);

  // Create new book
  const book = await Book.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      book,
      loggedInUser: res.loggedInUser,
    },
  });
});

exports.getBook = catchAsyncFn(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate({
    path: "reviews",
  });

  if (!book) {
    // Create an instance of an application error
    const applicationError = new ApplicationError(
      `Invalid ID: ${req.params.id} is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      book,
      loggedInUser: res.loggedInUser,
    },
  });
});

exports.updateBook = catchAsyncFn(async (req, res, next) => {
  const updatedBook = await req.Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    // Create an instance of an application error
    const applicationError = new ApplicationError(
      `Invalid ID: ${req.params.id} is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(200).json({
    status: "success",
    loggedInUser: res.loggedInUser,
    data: {
      updatedBook,
      loggedInUser: res.loggedInUser,
    },
  });
});

exports.deleteBook = catchAsyncFn(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    // Create an instance of an application error
    const applicationError = new ApplicationError(
      `Invalid ID: ${req.params.id} is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(204).json({
    status: "success",
    loggedInUser: res.loggedInUser,
    data: {
      loggedInUser: res.loggedInUser,
    },
  });
});
