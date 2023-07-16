const Card = require('../models/card');

const getAllCards = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getAllCards');
  try {
    const cards = await Card.find({});
    if (cards.length === 0) {
      res.status(404).send([]);
      return;
    }
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('createCard');
  const { name, link } = req.body;
  try {
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    // eslint-disable-next-line no-console
    console.log(card);
    return res.status(201).send(card);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).send({ message: errors.join(', ') });
  }
};

const deleteCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteCard');
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    res.status(400).send({ message: 'На сервере произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('likeCard');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId, runValidators: true } },
      { new: true },
    );

    if (card) {
      res.status(201).send(card);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    res.status(400).send({ message: 'На сервере произошла ошибка' });
  }
};

const deleteLike = async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('deleteLike');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: ownerId } },
      { new: true },
    );

    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    res.status(400).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
