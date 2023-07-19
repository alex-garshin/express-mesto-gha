const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { ErrorHandler } = require('../errors/handleError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неверный формат данных',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Неверный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = (email, password) => {
  userSchema.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorHandler(401, 'Передан неверный логин или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorHandler(401, 'Передан неверный логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
