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
    _id: '64b267af8a62f1242be227dc',
  };

  next();
});

app.use('/', users);
app.use('/', cards);

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log(`App  listening on port ${PORT}`);
  });
});
