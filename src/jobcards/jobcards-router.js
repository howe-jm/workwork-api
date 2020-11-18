const path = require('path');
const express = require('express');
const xss = require('xss');
const JobCardsService = require('./jobcards-service');

const jobCardsRouter = express.Router();
const jsonParser = express.json();

const serializeJobCard = (data) => ({
  id: data.id,
  userId: data.user_id,
  companyName: xss(data.companyname),
  jobTitle: xss(data.jobtitle),
  jobUrl: xss(data.joburl),
  jobAdded: data.job_added,
  comments: data.comments,
});

jobCardsRouter
  .route('/:user_name/cards/')
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
  .get((req, res) => {
    res.status(403).end();
  })
  .post(jsonParser, (req, res, next) => {
    const { companyName, jobTitle, jobUrl } = req.body;
    const newCard = {
      user_id: res.user.id,
      companyname: companyName,
      jobtitle: jobTitle,
      joburl: jobUrl,
    };

    for (const [key, value] of Object.entries(newCard)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    JobCardsService.insertCard(req.app.get('db'), newCard)
      .then((card) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${card.id}`))
          .json(serializeJobCard(card));
      })
      .catch(next);
  });

jobCardsRouter
  .route('/:user_name/cards/:card_id')
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
    res.json(serializeJobCard(res.card));
  })
  .delete((req, res, next) => {
    JobCardsService.deleteCard(req.app.get('db'), req.params.card_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { companyName, jobTitle, jobUrl, comments } = req.body;
    if (
      !companyName ||
      companyName === '' ||
      !jobTitle ||
      jobTitle === '' ||
      !jobUrl ||
      jobUrl === ''
    ) {
      return res.status(400).json({
        error: {
          message:
            'Body must contain contactName, contactTItle, and either contactEmail or contactPhone',
        },
      });
    }

    const updatedCard = {
      companyname: companyName,
      jobtitle: jobTitle,
      joburl: jobUrl,
      comments: comments,
    };

    JobCardsService.updateCard(req.app.get('db'), req.params.card_id, updatedCard)
      .then((card) => res.status(200).json(serializeJobCard(card)))
      .catch(next);
  });

module.exports = jobCardsRouter;
