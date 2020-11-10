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

const serializeStudyEvent = (event) => ({
  id: event.id,
  event_type: xss(event.event_type),
  card_id: event.card_id,
  date_added: event.date_added,
});

studyCardsRouter
  .route('/:user_name/studycards')
  .all((req, res, next) => {
    StudyCardsService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    StudyCardsService.getUserCards(req.app.get('db'), res.user.id)
      .then((cards) => {
        if (!cards) {
          return res.status(404).json({ error: { message: 'No cards found for user' } });
        }
        res.cards = cards;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.cards.map((card) => serializeStudyCard(card)));
  });

studyCardsRouter
  .route('/:user_name/studycards/events/')
  .all((req, res, next) => {
    StudyCardsService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    StudyCardsService.getUserCards(req.app.get('db'), res.user.id)
      .then((cards) => {
        if (!cards) {
          return res.status(204).end();
        }
        res.cards = cards;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    let cardsArray = res.cards.map((card) => card.id);
    StudyCardsService.getCardEvents(req.app.get('db'), cardsArray)
      .then((events) => {
        if (!events) {
          return res.status(204).end();
        }
        res.events = events;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.events.map((event) => serializeStudyEvent(event)));
  });

module.exports = studyCardsRouter;
