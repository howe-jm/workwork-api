require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobEventsArray } = require('./fixtures/jobevents.fixtures');

describe('Job Events Endpoints', () => {
  let db;

  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('Disconnect from db', () => db.destroy());

  before('Clean the table', () =>
    db.raw(
      'TRUNCATE workwork_jobcards, workwork_users, workwork_jobevents RESTART IDENTITY CASCADE'
    )
  );

  afterEach('Cleanup the tables', () =>
    db.raw(
      'TRUNCATE workwork_jobcards, workwork_users, workwork_jobevents RESTART IDENTITY CASCADE'
    )
  );

  describe('GET /api/jobevents', () => {
    context('Given no events', () => {
      it('Returns a 404 error', () => {
        return supertest(app)
          .get('/api/jobevents')
          .expect(404, { error: { message: 'No job events' } });
      });
    });
  });
  context('Given there are events in the db', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testEvents = makeJobEventsArray();

    beforeEach('Insert users', () => {
      return db
        .into('workwork_users')
        .insert(testUsers)
        .then(() => {
          return db.into('workwork_jobcards').insert(testCards);
        })
        .then(() => {
          return db.into('workwork_jobevents').insert(testEvents);
        });
    });
    it('Responds with 200 and all of the events', () => {
      return supertest(app).get('/api/jobevents').expect(200, testEvents);
    });
  });

  describe('GET /api/jobevents/:event_id', () => {
    context('Given no events', () => {
      it('Returns a 404 error', () => {
        const eventId = 3;
        return supertest(app)
          .get(`/api/jobevents/${eventId}`)
          .expect(404, { error: { message: 'Event not found' } });
      });
    });
  });
});
