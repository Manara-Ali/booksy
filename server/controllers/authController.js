const util = require("util");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsyncFn = require("../utils/catchAsyncFn");
const ApplicationError = require("../utils/applicationError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const createAndSendToken = require("../utils/createAndSendToken");

// const signToken = (id) => {
//   const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRATION_DATE,
//   });

//   return token;
// };

// const createAndSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRATION_DATE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   if (process.env.NODE_ENV === "production") {
//     cookieOptions.secure = true;
//   }

//   res.cookie("jwt", token, cookieOptions);

//   // Remove sensitive data
//   user.role = undefined;
//   user.password = undefined;
//   user.createdAt = undefined;
//   user.active = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

exports.signup = catchAsyncFn(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createAndSendToken(user, 201, res);
});

exports.login = catchAsyncFn(async (req, res, next) => {
  // 1. Retrieve email && password
  const { email, password } = req.body;

  if (!email || !password) {
    const applicationError = new ApplicationError(
      "Email and password are required to log in",
      400
    );

    next(applicationError);
  }

  // 2. Compare email and password to one in db
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    const applicationError = new ApplicationError(
      "Invalid email or password. Try again",
      401
    );

    next(applicationError);

    return;
  }

  createAndSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() - 10000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

// Create a function to protect given routes
exports.protect = catchAsyncFn(async (req, res, next) => {
  let token;

  // 1. Retrieve token from request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    const applicationError = new ApplicationError(
      "You are not logged in. Please log in and try again",
      401
    );

    next(applicationError);

    return;
  }

  // 2. Find the user associated with the token
  const decodedPayload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3. Verifty that user still exist
  const user = await User.findById(decodedPayload.id).select(
    "+password +passwordChangedAt +role"
  );

  if (!user) {
    const applicationError = new ApplicationError(
      "This user is no longer a part of our community. Please log back in.",
      401
    );

    next(applicationError);
  }

  // 4. JWT ERROR
  // 5. TOKEN EXPIRED ERROR

  // 6. Verify that the password was not recently changed
  if (user.wasPasswordChanged(decodedPayload.iat)) {
    const applicationError = new ApplicationError(
      "Your password was recently changed. Please log back in with new password and try again.",
      401
    );

    next(applicationError);

    return;
  }

  // 7. Attach user to request object
  req.user = user;

  next();
});

// Create a middleware to determine if the user is loggedin
exports.isLoggedIn = catchAsyncFn(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decodedPayload = await util.promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET_KEY
    );

    const currentUser = await User.findById(decodedPayload.id).select(
      "+password +passwordChangedAt +role"
    );

    if (!currentUser) {
      next();
      return;
    }

    // 6. Verify that the password was not recently changed
    if (currentUser.wasPasswordChanged(decodedPayload.iat)) {
      next();
      return;
    }

    // 7. Attach user to request object
    currentUser.password = undefined;
    currentUser.role = undefined;

    res.loggedInUser = currentUser;

    // console.log("HERE", res.loggedInUser);

    next();

    return;
  }

  // res.loggedInUser = null;
  res.loggedInUser = {};

  // console.log("THERE", res.loggedInUser);

  next();
});

exports.restrictTo = (...args) => {
  return (req, res, next) => {
    if (!args.includes(req.user.role)) {
      const applicationError = new ApplicationError(
        "You do not have permission to access this resource.",
        403
      );

      next(applicationError);

      return;
    }

    next();
  };
};

exports.forgotPassword = catchAsyncFn(async (req, res, next) => {
  // 1. Retrieve user email
  const { email } = req.body;

  if (!email) {
    const applicationError = new ApplicationError(
      "Your email is required to reset your password.",
      400
    );

    next(applicationError);

    return;
  }

  // 2. Use email to find user
  const user = await User.findOne({ email });

  if (!user) {
    const applicationError = new ApplicationError(
      "No record found matching the provided email. Verify email address and try again.",
      404
    );

    next(applicationError);

    return;
  }

  // 3. Generate password reset token
  const resetToken = user.generateResetToken();

  const resetTokenUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const resetPasswordSubject = "Password Reset Token (valid for 10 minutes)";

  const resetTokenMsg = `Forgot Password? Please use the url below to reset your password.\n${resetTokenUrl}.\nIf you did not request for a password reset, please ignore this message.`;

  // 4. Send reset token via email
  try {
    await sendEmail({
      email: user.email,
      subject: resetPasswordSubject,
      message: resetTokenMsg,
    });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "A password reset token was sent to the email we have on file!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationDate = undefined;

    await user.save({ validateBeforeSave: false });

    const applicationError = new ApplicationError(
      "Something went wrong while sending a password reset token. Try again later.",
      500
    );

    next(applicationError);

    return;
  }
});

exports.resetPassword = catchAsyncFn(async (req, res, next) => {
  // 1. Retrieve reset token
  const resetToken = req.params.token;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 2. Use reset token to find user
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpirationDate: { $gte: Date.now() },
  }).select("+passwordChangedAt");

  if (!user) {
    const applicationError = new ApplicationError(
      "Invalid or expired password reset token. Try again",
      401
    );

    next(applicationError);

    return;
  }

  // 3. Update user password
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    const applicationError = new ApplicationError(
      "Please provide new password and confirm new password",
      400
    );

    next(applicationError);

    return;
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpirationDate = undefined;

  await user.save();

  createAndSendToken(user, 200, res);
});

// Create a function to update user's password
exports.updatePassword = catchAsyncFn(async (req, res, next) => {
  // 1. Retrieve current password
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword) {
    const applicationError = new ApplicationError(
      "Your existing password is required to update to a new password",
      401
    );

    next(applicationError);

    return;
  }

  // 2. Compare current password to existing password
  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.comparePassword(currentPassword, user.password))) {
    const applicationError = new ApplicationError(
      "The password you provided does not match the one we have on file. Try again.",
      401
    );

    next(applicationError);

    return;
  }

  // 3. Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});
