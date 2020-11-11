const path = require('path');
const express = require('express');
const xss = require('xss');
const ContactsService = require('./contacts-service');

const jobContactsRouter = express.Router();
const jsonParser = express.json();

const serializeJobContact = (contact) => ({
  id: contact.id,
  contactname: xss(contact.contactname),
  contactnumber: xss(contact.contactnumber),
  contacttitle: xss(contact.contacttitle),
  date_added: contact.date_added,
  card_id: contact.card_id,
});

jobContactsRouter
  .route('/:user_name/')
  .all((req, res, next) => {
    ContactsService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    ContactsService.getUserCards(req.app.get('db'), res.user.id)
      .then((cards) => {
        if (!cards) {
          return res.status(204).end();
        }
        res.cards = cards;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    let cardsArray = res.cards.map((card) => card.id);
    ContactsService.getCardContacts(req.app.get('db'), cardsArray)
      .then((contacts) => {
        if (!contacts) {
          return res.status(204).end();
        }
        res.contacts = contacts;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.contacts.map((contact) => serializeJobContact(contact)));
  });

jobContactsRouter
  .route('/:user_name/:card_id')
  .all((req, res, next) => {
    ContactsService.getUserById(req.app.get('db'), req.params.user_name)
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
    ContactsService.getCardById(req.app.get('db'), req.params.card_id)
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
    ContactsService.getSingleCardContact(req.app.get('db'), res.card.id)
      .then((contacts) => {
        if (!contacts) {
          return res.status(204).end();
        }
        res.contacts = contacts;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.contacts.map((contact) => serializeJobContact(contact)));
  });

module.exports = jobContactsRouter;
