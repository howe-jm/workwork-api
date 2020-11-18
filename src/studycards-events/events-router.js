const path = require('path');
const express = require('express');
const xss = require('xss');
const EventsService = require('./events-service');
const EventService = require('./events-service');

const studyEventsRouter = express.Router();
const jsonParser = express.json();

const serializeJobEvent = (event) => ({
  id: event.id,
  eventType: xss(event.event_type),
  cardId: event.card_id,
  dateAdded: event.date_added,
});

studyEventsRouter
  .route('/:user_name/events/:card_id')
  .all((req, res, next) => {
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
  })
  .post(jsonParser, (req, res, next) => {
    const { eventType } = req.body;
    const card_id = res.card.id;
    const newEvent = {
      event_type: eventType,
      card_id,
    };

    for (const [key, value] of Object.entries(newEvent)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    EventsService.insertEvent(req.app.get('db'), newEvent)
      .then((jobEvent) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${jobEvent.id}`))
          .json(serializeJobEvent(jobEvent));
      })
      .catch(next);
  });

studyEventsRouter
  .route('/:user_name/events/delete/:event_id')
  .all((req, res, next) => {
    EventsService.getUserById(req.app.get('db'), req.params.user_name)
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
    EventsService.getSingleCardEvent(req.app.get('db'), req.params.event_id)
      .then((jobEvent) => {
        if (!jobEvent) {
          return res.status(404).json({ error: { message: 'Contact not found' } });
        }
        res.event = jobEvent;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.event.map((jobEvent) => serializeJobEvent(jobEvent)));
  })
  .delete((req, res, next) => {
    EventsService.deleteEvent(req.app.get('db'), req.params.event_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });
module.exports = studyEventsRouter;
