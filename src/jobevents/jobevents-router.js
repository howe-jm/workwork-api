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

module.exports = jobEventsRouter;
