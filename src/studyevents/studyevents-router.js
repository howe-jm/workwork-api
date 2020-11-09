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

studyEventsRouter.route('/').get((req, res, next) => {
  StudyEventsService.getAllStudyEvents(req.app.get('db'))
    .then((events) => {
      if (events.length === 0) {
        return res.status(404).json({
          error: { message: 'No study events' },
        });
      }
      res.json(events);
    })
    .catch(next);
});

studyEventsRouter
  .route('/:event_id')
  .all((req, res, next) => {
    StudyEventsService.getStudyEventById(req.app.get('db'), req.params.event_id)
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
    res.json(serializeStudyEvent(res.event));
  });

module.exports = studyEventsRouter;
