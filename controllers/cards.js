const Card = require('../models/card');

const validationErrorCode = 400;
const castErrorCode = 404;
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(castErrorCode).send({ message: 'Карточка с указанным _id не найдена' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.name === 'CastError') {
        res.status(castErrorCode).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      if (err.name === 'CastError') {
        res.status(castErrorCode).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.status(serverErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};
