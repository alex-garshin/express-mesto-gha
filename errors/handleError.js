class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, res) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Ошибка обновления данных в базе. Необходимо указывать уникальные данные' });
  }
  return res.status(500).send({ message: 'Ошибка сервера' });
};

module.exports = {
  CustomError,
  handleError,
};
