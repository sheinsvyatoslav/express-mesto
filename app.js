require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

// const { NODE_ENV, JWT_SECRET } = process.env;

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerCards);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
