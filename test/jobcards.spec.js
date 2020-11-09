require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');

describe('Job Cards Endpoints', () => {
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
    db.raw('TRUNCATE workwork_jobcards, workwork_users RESTART IDENTITY CASCADE')
  );

  afterEach('Cleanup the tables', () =>
    db.raw('TRUNCATE workwork_jobcards, workwork_users RESTART IDENTITY CASCADE')
  );

  describe('GET /api/jobcards', () => {
    context('Given no cards', () => {
      it('Returns a 404 error', () => {
        return supertest(app)
          .get('/api/jobcards')
          .expect(404, { error: { message: 'No job cards' } });
      });
    });
  });
  context('Given there are cards in the db', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();

    beforeEach('Insert users', () => {
      return db
        .into('workwork_users')
        .insert(testUsers)
        .then(() => {
          return db.into('workwork_jobcards').insert(testCards);
        });
    });
    it('Responds with 200 and all of the cards', () => {
      return supertest(app).get('/api/jobcards').expect(200, testCards);
    });
  });

  describe('GET /api/jobcards/:card_id', () => {
    context('Given no cards', () => {
      it('Returns a 404 error', () => {
        const cardId = 3;
        return supertest(app)
          .get(`/api/jobcards/${cardId}`)
          .expect(404, { error: { message: 'Card not found' } });
      });
    });
  });
});
