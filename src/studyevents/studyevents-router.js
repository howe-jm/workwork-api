const path = require('path');
const express = require('express');
const xss = require('xss');
const StudyEventsService = require('./studyevents-service');

const studyEventsRouter = express.Router();
const jsonParser = express.json();

const serializeStudyEvent = (event) => ({
  id: event.id,
  event_type: xss(event.event_type),
  card_id: event.card_id,
  date_added: event.date_added,
});

studyEventsRouter
  .route('/')
  .get((req, res, next) => {
    StudyEventsService.getUserCards(req.app.get('db'), req.params.user_name)
      .then((cards) => {
        if (!cards) {
          return res.status(404).json({ message: { error: 'No cards found' } });
        }
        res.cards = cards;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.cards = res.cards.map((card) => serializeStudyEvent(card));
    return res.json(res.cards);
  });

module.exports = studyEventsRouter;
