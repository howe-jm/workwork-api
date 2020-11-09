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
  date_added: event.date_added,
  card_id: event.card_id,
});

jobContactsRouter.route('/').get((req, res, next) => {
  JobContactsService.getAllJobContacts(req.app.get('db'))
    .then((contacts) => {
      if (contacts.length === 0) {
        return res.status(404).json({
          error: { message: 'No job contacts' },
        });
      }
      res.json(contacts);
    })
    .catch(next);
});

module.exports = jobContactsRouter;
