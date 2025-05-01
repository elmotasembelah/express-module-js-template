const { ApiError } = require("./api-error");

const sendErrorDev = (err, res) => {
  console.log(err);

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  console.error("Unhandled Error 🔥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

const handleDuplicateFieldDb = (err) => {
  const duplicateKey = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateKey];
  const message = `The value '${duplicateValue}' for the field '${duplicateKey}' is already used.`;
  return new ApiError(message, 400);
};

const handleCastErrorDb = (err) => {
  const message = `Invalid value for '${err.path}': '${err.value}'`;
  return new ApiError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = errors.join(", ");
  return new ApiError(message, 400);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDb(err);
    if (err.code === 11000) err = handleDuplicateFieldDb(err);
    if (err.name === "ValidationError") err = handleValidationError(err);

    sendErrorProd(err, res);
  }
};

module.exports = { errorHandler };
