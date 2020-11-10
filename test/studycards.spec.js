require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeStudyCardsArray } = require('./fixtures/studycards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');

describe('Study Cards Endpoints', () => {
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
    db.raw('TRUNCATE workwork_studycards, workwork_users RESTART IDENTITY CASCADE')
  );

  afterEach('Cleanup the tables', () =>
    db.raw('TRUNCATE workwork_jobcards, workwork_users RESTART IDENTITY CASCADE')
  );

  describe(`Getting a user's study cards.`, () => {
    context('There are no cards in the db', () => {
      const testUsers = makeUsersArray();

      beforeEach('Insert users', () => {
        return db.into('workwork_users').insert(testUsers);
      });
    });
    it('Responds with a 404 error.', () => {
      return supertest(app)
        .get('/api/studyevents')
        .expect(404, { message: { error: 'No cards found' } });
    });
  });
});
