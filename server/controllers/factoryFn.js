// const compareUserId = catchAsyncFn(async (req, res, Model, next) => {
//   const document = await Model.findById(req.params.id);

//   if (req.user.id !== document.userId.toString()) {
//     const applicationError = new ApplicationError(
//       "You are not allowed to perform this action.",
//       403
//     );

//     next(applicationError);

//     return;
//   }

//   next();
// });

// module.exports = compareUserId;

exports.compareId = function (Model, asyncFn) {
  return (req, res, next) => {
    req.Model = Model;
    return asyncFn(req, res, next).catch((error) => next(error));
  };
};
