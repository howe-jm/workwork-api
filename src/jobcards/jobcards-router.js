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

jobCardsRouter.route('/').get((req, res, next) => {
  JobCardsService.getAllJobCards(req.app.get('db'))
    .then((cards) => {
      if (cards.length === 0) {
        return res.status(404).json({
          error: { message: 'No job cards' },
        });
      }
      res.json(cards);
    })
    .catch(next);
});

jobCardsRouter
  .route('/:card_id')
  .all((req, res, next) => {
    JobCardsService.getJobCardById(req.app.get('db'), req.params.card_id)
      .then((card) => {
        if (!card) {
          return res.status(404).json({ error: { message: 'Card not found' } });
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeJobCard(res.card));
  });

module.exports = jobCardsRouter;
