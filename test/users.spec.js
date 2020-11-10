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

  describe('GET /api/users/:user_id', () => {
    context('Given no users', () => {
      it('Returns a 404 error', () => {
        const userId = 3;
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(404, { error: { message: 'User not found' } });
      });
    });
    context('Given users in the database', () => {
      const testUsers = makeUsersArray();

      beforeEach('Insert users', () => {
        return db.into('workwork_users').insert(testUsers);
      });
      it('Returns the specified user', () => {
        const userId = 3;
        const expectedUser = testUsers[userId - 1];
        return supertest(app).get(`/api/users/${userId}`).expect(200, expectedUser);
      });
    });
  });

  describe('DELETE /api/users/:user_id', () => {
    context('Given no users', () => {
      it('Returns a 404 error', () => {
        const userId = 3;
        return supertest(app)
          .delete(`/api/users/${userId}`)
          .expect(404, { error: { message: 'User not found' } });
      });
    });
    context('Given users in the database', () => {
      const testUsers = makeUsersArray();

      beforeEach('Insert users', () => {
        return db.into('workwork_users').insert(testUsers);
      });
      it('Returns 204 and removes the user', () => {
        const userId = 3;
        const expectedUsers = testUsers.filter((user) => user.id !== userId);
        return supertest(app)
          .delete(`/api/users/${userId}`)
          .expect(204)
          .then(() => {
            return supertest(app).get('/api/users').expect(expectedUsers);
          });
      });
    });
  });

  describe('POST /api/users/', () => {
    context('Given there are no users in the database', () => {
      it('Creates a new user and responds with 201 and the user', () => {
        const newUser = {
          firstname: 'Mister',
          lastname: 'Tester',
          username: 'MisterTester',
          password: 'testerpassword',
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body.firstname).to.eql(newUser.firstname);
            expect(res.body.lastname).to.eql(newUser.lastname);
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.password).to.eql(newUser.password);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
            const expected = new Date().toLocaleString();
            const actual = new Date(res.body.date_created).toLocaleString();
            expect(actual).to.eql(expected);
          })
          .then((postRes) => {
            return supertest(app)
              .get(`/api/users/${postRes.body.id}`)
              .expect(postRes.body);
          });
      });
    });
  });
});
