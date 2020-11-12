const path = require('path');
const express = require('express');
const xss = require('xss');
const EventsService = require('./events-service');
const EventService = require('./events-service');

const jobEventsRouter = express.Router();
const jsonParser = express.json();

const serializeJobEvent = (event) => ({
  id: event.id,
  eventtype: xss(event.eventtype),
  card_id: event.card_id,
  date_added: event.date_added,
});

jobEventsRouter
  .route('/:user_name/events/:card_id')
  .all((req, res, next) => {
    console.log('ping');
    EventService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .all((req, res, next) => {
    EventService.getCardById(req.app.get('db'), req.params.card_id)
      .then((card) => {
        if (!card) {
          return res.status(204).end();
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .all((req, res, next) => {
    if (res.card.user_id !== res.user.id) {
      return res.status(403).end();
    }
    EventService.getSingleCardEvent(req.app.get('db'), res.card.id)
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
    res.json(res.events.map((event) => serializeJobEvent(event)));
  });

module.exports = jobEventsRouter;
