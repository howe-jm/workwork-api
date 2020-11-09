const path = require('path');
const express = require('express');
const xss = require('xss');
const StudyCardsService = require('./studycards-service');

const studyCardsRouter = express.Router();
const jsonParser = express.json();

const serializeStudyCard = (card) => ({
  id: card.id,
  trainingname: xss(card.trainingname),
  trainingurl: xss(card.trainingurl),
  date_added: card.date_added,
  comments: xss(card.comments),
  user_id: card.user_id,
});

studyCardsRouter.route('/').get((req, res, next) => {
  StudyCardsService.getAllStudyCards(req.app.get('db'))
    .then((cards) => {
      if (cards.length === 0) {
        return res.status(404).json({
          error: { message: 'No study cards' },
        });
      }
      res.json(cards);
    })
    .catch(next);
});

studyCardsRouter
  .route('/:card_id')
  .all((req, res, next) => {
    StudyCardsService.getStudyCardById(req.app.get('db'), req.params.card_id)
      .then((card) => {
        if (!card) {
          return res.status(404).json({ error: { message: 'Card not found' } });
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeStudyCard(res.card));
  })
  .delete((req, res, next) => {
    StudyCardsService.deleteCard(req.app.get('db'), req.params.card_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = studyCardsRouter;
