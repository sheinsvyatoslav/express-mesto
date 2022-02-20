const User = require('../models/user');

const validationErrorCode = 400;
const notFoundErrorCode = 404;
const serverErrorCode = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => (user ? res.send(user) : res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному id не найден' })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(validationErrorCode).send({ message: 'Передан некорректный id пользователя' })
      : res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' })));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' })
      : res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' })));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) { res.status(400).send({ message: 'Поля \'name\' и \'about\' должны быть заполнены' }); }

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => (user ? res.send(user) : res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному id не найден' })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Передан некорректный id' });
      } else {
        res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!req.body.avatar) { res.status(400).send({ message: 'Поле \'avatar\' должно быть заполнено' }); }

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => (user ? res.send(user) : res.status(notFoundErrorCode).send({ message: 'Пользователь по указанному id не найден' })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
