const path = require('path');
const express = require('express');
const xss = require('xss');
const StudyCardsService = require('./studycards-service');

const studyCardsRouter = express.Router();
const jsonParser = express.json();

const serializeJobCard = (data) => ({
  id: data.id,
  userId: data.user_id,
  trainingName: xss(data.trainingname),
  trainingUrl: xss(data.trainingurl),
  dateAdded: data.card_added,
  comments: xss(data.comments),
});

studyCardsRouter
  .route('/:user_name/cards/')
  .all((req, res, next) => {
    StudyCardsService.getUserById(req.app.get('db'), req.params.user_name)
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
    const { trainingName, trainingUrl } = req.body;
    const newCard = {
      user_id: res.user.id,
      trainingname: trainingName,
      trainingurl: trainingUrl,
    };

    for (const [key, value] of Object.entries(newCard)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    StudyCardsService.insertCard(req.app.get('db'), newCard)
      .then((card) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${card.id}`))
          .json(serializeJobCard(card));
      })
      .catch(next);
  });

studyCardsRouter
  .route('/:user_name/cards/:card_id')
  .all((req, res, next) => {
    StudyCardsService.getUserById(req.app.get('db'), req.params.user_name)
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
    StudyCardsService.getCardById(req.app.get('db'), req.params.card_id)
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
    StudyCardsService.deleteCard(req.app.get('db'), req.params.card_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    console.log(req.body);
    const { trainingName, trainingUrl, comments } = req.body;
    if (!trainingName || trainingName === '' || !trainingUrl || trainingUrl === '') {
      return res.status(400).json({
        error: {
          message:
            'Body must contain contactName, contactTItle, and either contactEmail or contactPhone',
        },
      });
    }

    const updatedCard = {
      trainingname: trainingName,
      trainingurl: trainingUrl,
      comments: comments,
    };

    StudyCardsService.updateCard(req.app.get('db'), req.params.card_id, updatedCard)
      .then((card) => res.status(200).json(serializeJobCard(card)))
      .catch(next);
  });

module.exports = studyCardsRouter;
