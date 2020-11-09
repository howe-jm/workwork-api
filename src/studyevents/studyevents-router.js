const path = require('path');
const express = require('express');
const xss = require('xss');
const StudyEventsService = require('./studyevents-service');

const studyEventsRouter = express.Router();
const jsonParser = express.json();

const serializeStudyEvent = (event) => ({
  id: event.id,
  eventType: xss(event.eventtype),
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

module.exports = studyEventsRouter;
