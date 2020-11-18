const express = require('express');
const xss = require('xss');
const StateService = require('./studycards-state-service');

const studyCardsStateRouter = express.Router();

const serializeCardStateData = (data) => ({
  id: data.id,
  userId: data.user_id,
  trainingName: xss(data.trainingname),
  trainingUrl: xss(data.joburl),
  dateAdded: data.card_added,
  comments: xss(data.comments),
  events: [...data.events.map((event) => serializeStudyEvent(event))],
});

const serializeStudyEvent = (event) => ({
  id: event.id,
  eventType: xss(event.eventtype),
  cardId: event.card_id,
  dateAdded: event.event_added,
});

studyCardsStateRouter
  .route('/:user_name')
  .all((req, res, next) => {
    StateService.getUserById(req.app.get('db'), req.params.user_name)
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
    StateService.getUserCards(req.app.get('db'), res.user.id)
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
    StateService.getCardEvents(req.app.get('db'), cardsArray)
      .then((events) => {
        if (!events) {
          return res.status(204).end();
        }
        res.events = events;
        res.cards.map(
          (card) =>
            (card.events = res.events.filter((event) => event.card_id === card.id))
        );
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.cards.map((card) => serializeCardStateData(card)));
  });

module.exports = studyCardsStateRouter;
