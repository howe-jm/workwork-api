require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeStudyCardsArray } = require('./fixtures/studycards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeStudyEventsArray } = require('./fixtures/studyevents.fixtures');

describe('Study Events Endpoints', () => {
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
      'TRUNCATE workwork_studycards, workwork_users, workwork_studyevents RESTART IDENTITY CASCADE'
    )
  );

  afterEach('Cleanup the tables', () =>
    db.raw(
      'TRUNCATE workwork_studycards, workwork_users, workwork_studyevents RESTART IDENTITY CASCADE'
    )
  );

  describe('GET /api/studyevents', () => {
    context('Given no events', () => {
      it('Returns a 404 error', () => {
        return supertest(app)
          .get('/api/studyevents')
          .expect(404, { error: { message: 'No study events' } });
      });
    });
  });
  context('Given there are events in the db', () => {
    const testUsers = makeUsersArray();
    const testCards = makeStudyCardsArray();
    const testEvents = makeStudyEventsArray();

    beforeEach('Insert users', () => {
      return db
        .into('workwork_users')
        .insert(testUsers)
        .then(() => {
          return db.into('workwork_studycards').insert(testCards);
        })
        .then(() => {
          return db.into('workwork_studyevents').insert(testEvents);
        });
    });
    it('Responds with 200 and all of the events', () => {
      return supertest(app).get('/api/studyevents').expect(200, testEvents);
    });
  });

  describe('GET /api/studyevents/:event_id', () => {
    context('Given no events', () => {
      it('Returns a 404 error', () => {
        const eventId = 3;
        return supertest(app)
          .get(`/api/studyevents/${eventId}`)
          .expect(404, { error: { message: 'Event not found' } });
      });
    });
    context('Given events in the database', () => {
      const testUsers = makeUsersArray();
      const testCards = makeStudyCardsArray();
      const testEvents = makeStudyEventsArray();

      beforeEach('Insert events', () => {
        return db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => {
            return db.into('workwork_studycards').insert(testCards);
          })
          .then(() => {
            return db.into('workwork_studyevents').insert(testEvents);
          });
      });
      it('Returns the specified event', () => {
        const eventId = 3;
        const expectedEvent = testEvents[eventId - 1];
        return supertest(app)
          .get(`/api/studyevents/${eventId}`)
          .expect(200, expectedEvent);
      });
    });
  });
});
