require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const jobCardsRouter = require('./jobcards/jobcards-router');
const jobContactsRouter = require('./jobcards-contacts/contacts-router');
const jobEventsRouter = require('./jobcards-events/events-router');
// const studyCardsRouter = require('./studycards/studycards-router');
// const studyEventsRouter = require('./studyevents/studyevents-router');
const usersRouter = require('./users/users-router');
const jobCardsState = require('./jobcards-state/jobcards-state-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/jobcards', jobCardsRouter);
app.use('/api/jobcontacts', jobContactsRouter);
app.use('/api/jobevents', jobEventsRouter);
// app.use('/api/users', studyCardsRouter);
// app.use('/api/users', studyEventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/jobs', jobCardsState);

app.get('/', (req, res) => {
  res.status(204).end();
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
