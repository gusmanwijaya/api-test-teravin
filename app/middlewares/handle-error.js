const { StatusCodes } = require("http-status-codes");

const handleErrorMiddleware = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong, please try again later!",
  };

  if (error.name === "ValidationError") {
    customError.statusCode = 400;
    customError.message = Object.values(error.errors)
      .map((value) => value.message)
      .join(", ");
  }

  if (error.code && error.code === 11000) {
    customError.statusCode = 400;
    customError.message = `Duplicate value for field ${Object.keys(
      error.keyValue
    )}, please input another value!`;
  }

  if (error.name === "CastError") {
    customError.statusCode = 404;
    customError.message = `Data with id : ${error.value} not found!`;
  }

  return res.status(customError.statusCode).json({
    statusCode: customError.statusCode,
    message: customError.message,
  });
};

module.exports = handleErrorMiddleware;
