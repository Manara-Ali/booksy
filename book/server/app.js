const path = require("path");

// IMPORT EXPRESS TO CREATE AN EXPRESS APPLICATION
const express = require("express");

const morgan = require("morgan");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const cors = require("cors");

const cookieParser = require("cookie-parser");

// IMPORT BOOK ROUTER
const bookRouter = require("./routes/bookRoutes");

// IMPORT USER ROUTER
const userRouter = require("./routes/userRoutes");

// IMPORT REVIEW ROUTER
const reviewRouter = require("./routes/reviewRouter");

// IMPORT APPLICATION ERROR
const ApplicationError = require("./utils/applicationError");

// IMPORT ERROR CONTROLLER
const errorController = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(`${__dirname}/../client`, `public/img`)));

// Add body parser
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request coming from your IP Address. Try again in 1-hour.",
});

app.use("/api", limiter);

app.use(helmet());

app.use(
  hpp({
    whitelist: [
      "ratingsAverage",
      "ratingsQuantity",
      "numberOfPages",
      "author",
      "title",
      "numberOfChapters",
    ],
  })
);

// Router middlewares
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  //   const error = new Error(`Cannot find ${req.originalUrl} on our servers...`);
  const applicationError = new ApplicationError(
    `Cannot find ${req.originalUrl} on any of our servers...`,
    404
  );

  next(applicationError);
});

app.use(errorController.globalErrorHandler);

module.exports = app;
