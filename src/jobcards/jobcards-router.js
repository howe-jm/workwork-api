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

module.exports = jobCardsRouter;
