const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsyncFn = require("../utils/catchAsyncFn");
const ApplicationError = require("../utils/applicationError");
const filterReqBody = require("../utils/filterRequestBody");

exports.addUserInRoute = (req, res, next) => {
  if (!req.params.id) {
    req.params.id = req.user._id;
  }

  next();
};

exports.getAllUsers = catchAsyncFn(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsyncFn(async (req, res, next) => {
  const applicationError = new ApplicationError(
    "Please use /signup route to register.",
    400
  );

  next(applicationError);

  return;
});

exports.getUser = catchAsyncFn(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const applicationError = new ApplicationError(
      `Invalid ID: /${req.params.id}/ is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsyncFn(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const applicationError = new ApplicationError(
      `Invalid ID: /${req.params.id}/ is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsyncFn(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const applicationError = new ApplicationError(
      `Invalid ID: /${req.params.id}/ is not a valid ID. Try again.`,
      404
    );

    next(applicationError);

    return;
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(`${__dirname}/../../client`, "public/img/users"));
//   },
//   filename: (req, file, cb) => {
//     const extention = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extention}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    const applicationError = new ApplicationError(
      "Invalid file type uploaded. Please upload an image file and try again!",
      400
    );

    cb(applicationError, false);
  }
};

const multerUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = multerUpload.single("photo");

exports.processUserPhoto = catchAsyncFn(async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .withMetadata()
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(
      path.join(
        `${__dirname}/../../client`,
        `public/img/users/${req.file.filename}`
      )
    );

  next();
});

exports.updateMyInfo = catchAsyncFn(async (req, res, next) => {
  // 2. Compare provided password to password on file
  const user = await User.findOne({ _id: req.user._id });

  // 3. Update user info
  const allowedParameters = filterReqBody(req.body, "name", "email");
  if (req.file) {
    allowedParameters.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    allowedParameters,
    { new: true, runValidators: true }
  ).select("-password");

  // 4. Send response
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

exports.deleteMyAccount = catchAsyncFn(async (req, res, next) => {
  // 1. Retrieve current password
  const { currentPassword } = req.body;

  if (!currentPassword) {
    const applicationError = new ApplicationError(
      "Your existing password is required to delete your account. Try again.",
      401
    );

    next(applicationError);

    return;
  }

  // 2. Compare provided password to password on file
  const user = await User.findOne({ _id: req.user._id }).select(
    "+password +active"
  );

  if (!user || !(await user.comparePassword(currentPassword, user.password))) {
    const applicationError = new ApplicationError(
      "The password you provided does not match the one we have on file. Try again.",
      401
    );

    next(applicationError);

    return;
  }

  await User.findByIdAndUpdate({ _id: user._id }, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
