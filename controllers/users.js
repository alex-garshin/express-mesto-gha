const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { CustomError } = require('../errors/handleError');

const { NODE_ENV, JWT_SECRET } = process.env;
console.log(process.env.NODE_ENV);

const statusCode = {
  ok: 200,
  created: 201,
};

const createUser = async (req, res, next) => {
  console.log('createUser');
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: passHash,
      name,
      about,
      avatar,
    });
    res.status(statusCode.created).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError(400, 'Ошибка 400. Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  console.log('login');
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
      { expiresIn: '7d' },
    );

    res
      .send({ token, message: 'Успешный вход' });
    console.log(token);
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  console.log('getCurrentUser');
  const { _id } = req.user;
  console.log({ _id });
  try {
    const user = await User.findById(_id);
    if (!user) {
      next(new CustomError(404, 'Ошибка 404. Пользователь не найден'));
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  console.log('getAllUsers');
  try {
    const users = await User.find({});
    res.status(statusCode.ok).send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  console.log('getUser');
  const { userId } = req.params;
  console.log({ userId });
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new CustomError(404, 'Ошибка 404. Пользователь не найден'));
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  console.log('updateUser');
  const { name, about } = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      ownerId,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      next(new CustomError(404, 'Ошибка 404. Пользователь не найден'));
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  console.log('updateAvatar');
  const { avatar } = req.body;
  const ownerId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      ownerId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      next(new CustomError(404, 'Ошибка 404. Пользователь не найден'));
      return;
    }
    res.status(statusCode.ok).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
