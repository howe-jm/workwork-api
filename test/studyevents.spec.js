require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeJobCardsArray } = require('./fixtures/studycards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobEventsArray } = require('./fixtures/studyevents.fixtures');

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
});
