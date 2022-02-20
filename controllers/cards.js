const Card = require('../models/card');

const validationErrorCode = 400;
const notFoundErrorCode = 404;
const serverErrorCode = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании карточки' })
      : res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' })));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => (card ? res.send(card) : res.status(notFoundErrorCode).send({ message: 'Карточка по указанному id не найдена' })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(validationErrorCode).send({ message: 'Передан некорректный id карточки' })
      : res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' })));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send(card) : res.status(notFoundErrorCode).send({ message: 'Карточка по указанному id не найдена' })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send(card) : res.status(notFoundErrorCode).send({ message: 'Карточка по указанному id не найдена' })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      if (err.name === 'CastError') {
        res.status(validationErrorCode).send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
