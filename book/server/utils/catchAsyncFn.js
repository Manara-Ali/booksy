const catchAsyncFn = function (asyncFn) {
  return (req, res, next) =>
    asyncFn(req, res, next).catch((error) => next(error));
};

module.exports = catchAsyncFn;
