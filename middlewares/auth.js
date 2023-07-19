const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../errors/handleError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  console.log('authorization');
  const { authorization } = req.headers;
  console.log({ authorization });
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorHandler(401, 'Ошибка 401. Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(err);
  }

  req.user = payload;
  console.log(req.user);

  next();
};
