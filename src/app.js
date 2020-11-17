require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const jobContactsRouter = require('./jobcards-contacts/contacts-router');
const jobEventsRouter = require('./jobcards-events/events-router');
const jobCardsState = require('./jobcards-state/jobcards-state-router');
const jobCardsRouter = require('./jobcards/jobcards-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/jobs', jobCardsState);
app.use('/api/jobs', jobCardsRouter);
app.use('/api/jobs', jobEventsRouter);
app.use('/api/jobs', jobContactsRouter);

app.get('/', (req, res) => {
  res.status(204).end();
});

app.use(function errorHandler(error, req, res) {
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
