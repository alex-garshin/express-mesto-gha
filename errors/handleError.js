class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json(statusCode.toString().startsWith('5') ? {
    status: 'error',
    statusCode,
    message,
  } : new CustomError(statusCode, message));
};

module.exports = {
  CustomError,
  handleError,
};
