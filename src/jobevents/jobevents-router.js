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

module.exports = jobEventsRouter;
