const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64b3ac8c30371577b57ed95d',
  };

  next();
});

app.use('/', users);
app.use('/', cards);
app.use((req, res) => {
  res.status(404).send({ message: 'Данный маршрут не существует' });
});

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App  listening on port ${PORT}`);
  });
});
