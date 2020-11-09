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
  card_id: card.card_id,
  date_added: card.date_added,
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

module.exports = studyCardsRouter;
