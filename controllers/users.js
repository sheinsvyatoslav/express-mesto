const User = require('../models/user');

const validationErrorCode = 400;
const castErrorCode = 404;
const serverErrorCode = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(castErrorCode).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'CastError') {
        res.status(castErrorCode).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'CastError') {
        res.status(castErrorCode).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};
