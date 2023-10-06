const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Each user must have a name"],
      minlength: [2, "Name field must be at least 2 characters long"],
      maxlength: [20, "Name field cannot exceed 20 characters long"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Each user must have an email address"],
      unique: [
        true,
        "This email address is already in use on our server. Try again",
      ],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address and try again.",
      },
      lowercase: true,
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ["user", "moderator", "admin"],
        message: "Roles can only be 'user', 'moderator', or 'admin'",
      },
      default: "user",
      select: false,
    },
    photo: {
      type: String,
      default: "user.jpg",
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is a required field"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: [true, "Password confirmation is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message:
          "Both password and password confirmation must match. Try again.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpirationDate: {
      type: Date,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a document middleware to encrypt user password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirm = undefined;
  next();
});

// Create a document middleware to update the time the password was changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    next();
    return;
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Create a query middleware to remove all inactive users
userSchema.pre(/^find/, function (next) {
  this.find({
    active: { $ne: false },
  });

  next();
});

// Create an instance method to compare user email and password
userSchema.methods.comparePassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Create an instance method to determine when the password was changed
userSchema.methods.wasPasswordChanged = function (JWTTimestamp) {
  let passwordChangeTimestamp;

  if (this.passwordChangedAt) {
    passwordChangeTimestamp = Number.parseInt(
      new Date(this.passwordChangedAt).getTime() / 1000
    );

    return passwordChangeTimestamp > JWTTimestamp;
  }

  return false;
};

// Create a method to generate password reset token
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpirationDate = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
