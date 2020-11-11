const path = require('path');
const express = require('express');
const xss = require('xss');
const StateService = require('./jobcards-state-service');

const jobCardsStateRouter = express.Router();

const serializeCardStateData = (data) => ({
  id: data.id,
  userId: data.user_id,
  companyName: xss(data.companyname),
  jobTitle: xss(data.jobtitle),
  jobUrl: xss(data.joburl),
  dateAdded: data.date_added,
  comments: xss(data.comments),
  contacts: [...data.contacts],
  events: [...data.events],
});

jobCardsStateRouter
  .route('/:user_name')
  .all((req, res, next) => {
    StateService.getUserById(req.app.get('db'), req.params.user_name)
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
    StateService.getUserCards(req.app.get('db'), res.user.id)
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
    StateService.getCardEvents(req.app.get('db'), cardsArray)
      .then((events) => {
        if (!events) {
          return res.status(204).end();
        }
        res.events = events;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    let cardsArray = res.cards.map((card) => card.id);
    StateService.getCardContacts(req.app.get('db'), cardsArray)
      .then((contacts) => {
        if (!contacts) {
          return res.status(204).end();
        }
        res.contacts = contacts;
        res.cards.map(
          (card) =>
            (card.contacts = res.contacts.filter(
              (contact) => contact.card_id === card.id
            ))
        );
        res.cards.map(
          (card) =>
            (card.events = res.events.filter((event) => event.card_id === card.id))
        );
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.cards.map((card) => serializeCardStateData(card)));
  });

module.exports = jobCardsStateRouter;
