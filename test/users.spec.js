require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/users.fixtures');

describe('Users Endpoints', () => {
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
    db.raw('TRUNCATE workwork_users RESTART IDENTITY CASCADE')
  );

  afterEach('Cleanup the tables', () =>
    db.raw('TRUNCATE workwork_users RESTART IDENTITY CASCADE')
  );

  describe('GET /api/users', () => {
    context('Given no cards', () => {
      it('Returns a 404 error', () => {
        return supertest(app)
          .get('/api/users')
          .expect(404, { error: { message: 'No users' } });
      });
    });
  });

  context('Given there are users in the db', () => {
    const testUsers = makeUsersArray();

    beforeEach('Insert users', () => {
      return db.into('workwork_users').insert(testUsers);
    });
    it('Responds with 200 and all of the folders', () => {
      return supertest(app).get('/api/users').expect(200, testUsers);
    });
  });

  describe('GET /api/users/:user_id', () => {
    context('Given no users', () => {
      it('Returns a 404 error', () => {
        const userId = 3;
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(404, { error: { message: 'User not found' } });
      });
    });
  });
});
