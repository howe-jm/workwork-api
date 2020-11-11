const path = require('path');
const express = require('express');
const xss = require('xss');
const JobCardsService = require('./jobcards-service');

const jobCardsRouter = express.Router();
const jsonParser = express.json();

const serializeJobCard = (card) => ({
  id: card.id,
  companyname: xss(card.companyname),
  jobtitle: xss(card.jobtitle),
  joburl: xss(card.joburl),
  date_added: card.date_added,
  comments: xss(card.comments),
  user_id: card.user_id,
});

const serializeJobContact = (event) => ({
  id: event.id,
  contactname: xss(event.contactname),
  contactnumber: xss(event.contactnumber),
  contacttitle: xss(event.contacttitle),
  date_added: event.date_added,
  card_id: event.card_id,
});

jobCardsRouter
  .route('/:user_name')
  .all((req, res, next) => {
    JobCardsService.getUserById(req.app.get('db'), req.params.user_name)
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
    JobCardsService.getUserCards(req.app.get('db'), res.user.id)
      .then((cards) => {
        if (!cards) {
          return res.status(204).end();
        }
        res.cards = cards;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.cards.map((card) => serializeJobCard(card)));
  })
  .post(jsonParser, (req, res, next) => {
    const { companyname, jobtitle, joburl } = req.body;
    const newCard = { companyname, jobtitle, joburl };

    for (const [key, value] of Object.entries(newCard)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newCard.user_id = res.user.id;

    JobCardsService.insertCard(req.app.get('db'), newCard)
      .then((card) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${card.id}`))
          .json(serializeJobCard(card));
      })
      .catch(next);
  });

jobCardsRouter
  .route('/:user_name/:card_id')
  .all((req, res, next) => {
    JobCardsService.getUserById(req.app.get('db'), req.params.user_name)
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
    JobCardsService.getCardById(req.app.get('db'), req.params.card_id)
      .then((card) => {
        if (!card) {
          return res.status(204).end();
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    if (res.card.user_id !== res.user.id) {
      return res.status(403).end();
    }
    res.json(serializeJobCard(res.card));
  })
  .delete((req, res, next) => {
    if (res.card.user_id !== res.user.id) {
      return res.status(403).end();
    }
    JobCardsService.deleteCard(req.app.get('db'), req.params.card_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = jobCardsRouter;
