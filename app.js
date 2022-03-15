require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { vaidateSignup, vaidateSignin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: ['https://mesto.project.frontend.nomoredomains.work', 'http://mesto.project.frontend.nomoredomains.work'],
  credentials: true,
}));
/*
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }
  next();
});
*/
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', vaidateSignup, createUser);
app.post('/signin', vaidateSignin, login);
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCards);
app.use(errorLogger);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
