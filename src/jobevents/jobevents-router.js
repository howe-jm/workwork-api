const path = require('path');
const express = require('express');
const xss = require('xss');
const JobEventsService = require('./jobevents-service');

const jobEventsRouter = express.Router();
const jsonParser = express.json();

const serializeJobEvent = (event) => ({
  id: event.id,
  eventtype: xss(event.eventtype),
  card_id: event.card_id,
  date_added: event.date_added,
});

jobEventsRouter.route('/').get((req, res, next) => {
  JobEventsService.getAllJobEvents(req.app.get('db'))
    .then((events) => {
      if (events.length === 0) {
        return res.status(404).json({
          error: { message: 'No job events' },
        });
      }
      res.json(events);
    })
    .catch(next);
});

jobEventsRouter
  .route('/:event_id')
  .all((req, res, next) => {
    JobEventsService.getJobEventById(req.app.get('db'), req.params.event_id)
      .then((event) => {
        if (!event) {
          return res.status(404).json({ error: { message: 'Event not found' } });
        }
        res.event = event;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeJobEvent(res.event));
  })
  .delete((req, res, next) => {
    JobEventsService.deleteEvent(req.app.get('db'), req.params.event_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = jobEventsRouter;
