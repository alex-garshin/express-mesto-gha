class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// const handleError = (err, res) => {
//   const { statusCode, message } = err;
//   res.status(statusCode).json({
//     status: 'error',
//     statusCode,
//     message,
//   });
// };

const handleError = (err, res) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(500).send({ message: 'Ошибка сервера' });
};

module.exports = {
  CustomError,
  handleError,
};
