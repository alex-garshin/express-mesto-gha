const Card = require('../models/card');

const { CustomError } = require('../errors/handleError');

const statusCode = {
  ok: 200,
  created: 201,
};

const getAllCards = async (req, res, next) => {
  console.log('getAllCards');
  try {
    const cards = await Card.find({}).populate('owner');
    res.status(statusCode.ok).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  console.log('createCard');
  const { name, link } = req.body;
  try {
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    console.log(card);
    res.status(statusCode.created).send(card);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  console.log('deleteCard');
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card
      .findById(cardId)
      .orFail(new CustomError(404, 'Ошибка 404. Карточка не найдена'))
      .populate('owner');
    const ownerId = card.owner._id.toString();
    if (ownerId !== userId) {
      next(new CustomError(403, 'Ошибка 403. Попытка удалить чужую карточку'));
      return;
    }
    await Card.findByIdAndRemove(cardId);
    res.status(statusCode.ok).send(card);
  } catch (err) {
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  console.log('likeCard');
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: ownerId } },
        { new: true },
      )
      .orFail(new CustomError(404, 'Ошибка 404. Карточка не найдена'))
      .populate(['owner', 'likes']);
    res.status(statusCode.ok).send(card);
  } catch (err) {
    next(err);
  }
};

const deleteLike = async (req, res, next) => {
  console.log('deleteLike');
  try {
    const { cardId } = req.params;
    const ownerId = req.user._id;
    const card = await Card
      .findByIdAndUpdate(
        cardId,
        { $pull: { likes: ownerId } },
        { new: true },
      )
      .orFail(new CustomError(404, 'Ошибка 404. Карточка не найдена'))
      .populate(['owner', 'likes']);
    res.status(statusCode.ok).send(card);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
