const path = require('path');
const express = require('express');
const xss = require('xss');
const JobContactsService = require('./jobcontacts-service');

const jobContactsRouter = express.Router();
const jsonParser = express.json();

const serializeJobContact = (event) => ({
  id: event.id,
  contactname: xss(event.contactname),
  contactnumber: xss(event.contactnumber),
  contacttitle: xss(event.contacttitle),
  date_added: event.date_added,
  card_id: event.card_id,
});

module.exports = jobContactsRouter;
