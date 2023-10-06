// IMPORT APPLICATION ERROR
const ApplicationError = require("../utils/applicationError");

const sendDevError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
    loggedInUser: res.loggedInUser,
  });
};

const sendProdError = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      loggedInUser: res.loggedInUser,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Try again later...",
      loggedInUser: res.loggedInUser,
    });
  }
};

// 1. CASTERROR
const handleCastError = (error) => {
  // Create an instance of an application error
  const applicationError = new ApplicationError(
    `Invalid ID: ${error.value} is not a valid ID.`,
    400
  );

  return applicationError;
};

// 2. VALIDATORERROR
const handleValidationError = (error) => {
  const errorArr = Object.values(error.errors);

  const errorMsgArr = errorArr.map((element) => {
    return element.message;
  });

  const errorMsg = errorMsgArr.join(". ");

  const applicationError = new ApplicationError(errorMsg, 400);

  return applicationError;
};

// 3. DUPLICATE ERROR
const handleDuplicateError = (error) => {
  const errorArr = Object.values(error);

  const { email } = errorArr[3];

  const applicationError = new ApplicationError(
    `Duplicate Error: /${email}/ already exist. Please try again`,
    401
  );

  return applicationError;
};

// 4. JsonWebTokenError
const handleJsonWebTokenError = (error) => {
  const applicationError = new ApplicationError(
    "Invalid Token Signature. Please log back in and try again.",
    401
  );

  return applicationError;
};

// 5. TokenExpiredError
const handleTokenExpiredError = (error) => {
  const applicationError = new ApplicationError(
    "Invalid or expired login token. Please log back in and try again",
    401
  );

  return applicationError;
};

exports.globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(error, res);
  } else if (process.env.NODE_ENV === "production") {
    // Create a mongoose error variable
    let mongooseError;

    // 1. CastError
    if (error.name === "CastError") {
      mongooseError = { ...error };

      mongooseError = handleCastError(mongooseError);

      sendProdError(mongooseError, res);
    }

    // 2. ValidationError
    if (error.name === "ValidationError") {
      mongooseError = { ...error };

      mongooseError = handleValidationError(mongooseError);

      sendProdError(mongooseError, res);
    }

    // 3. Duplicate Error
    if (error.code === 11000) {
      mongooseError = { ...error };

      mongooseError = handleDuplicateError(mongooseError);

      sendProdError(mongooseError, res);
    }

    // 4. JsonWebTokenError
    if (error.name === "JsonWebTokenError") {
      mongooseError = { ...error };

      mongooseError = handleJsonWebTokenError(mongooseError);

      sendProdError(mongooseError, res);
    }

    // 5. TokenExpiredError
    if (error.name === "TokenExpiredError") {
      mongooseError = { ...error };

      mongooseError = handleTokenExpiredError(mongooseError);

      sendProdError(mongooseError, res);
    }

    if (!mongooseError) {
      sendProdError(error, res);
    }
  }
};
