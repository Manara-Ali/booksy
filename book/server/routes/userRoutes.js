// IMPORT EXPRESS TO CREATE ROUTERS
const express = require("express");

// IMPORT USER CONTROLLER
const userController = require("../controllers/userController");

// IMPORT AUTH CONTROLLER
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/logout").get(authController.logout);

router.route("/forgot-password").post(authController.forgotPassword);

router.route("/reset-password/:token").patch(authController.resetPassword);

router
  .route("/update-password")
  .patch(authController.protect, authController.updatePassword);

router
  .route("/update-my-info")
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.processUserPhoto,
    userController.updateMyInfo
  );

router
  .route("/delete-my-account")
  .delete(authController.protect, userController.deleteMyAccount);

router
  .route("/my-account")
  .get(
    authController.protect,
    userController.addUserInRoute,
    userController.getUser
  );

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
