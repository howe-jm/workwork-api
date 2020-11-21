require('dotenv').config();
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeJobCardsState } = require('./fixtures/jobcardsstate.json');
const { makeJobContactsArray } = require('./fixtures/jobcontacts.fixtures');
const { makeJobEventsArray } = require('./fixtures/jobevents.fixtures');

describe('Job Cards State Endpoints', function () {
  let db;

  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('Disconnect from database', () => db.destroy());

  before('Clean the table', () =>
    db.raw(
      'TRUNCATE workwork_jobcontacts, workwork_jobevents, workwork_jobcards, workwork_users RESTART IDENTITY CASCADE;'
    )
  );

  afterEach('Clean the table', () =>
    db.raw(
      'TRUNCATE workwork_jobcontacts, workwork_jobevents, workwork_jobcards, workwork_users RESTART IDENTITY CASCADE;'
    )
  );

  describe('GET /:username/jobs', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();
    const testEvents = makeJobEventsArray();
    const jobCardsState = makeJobCardsState();

    context('Given a non-existent user', () => {
      it('Returns a 404 and message', () => {
        return supertest(app)
          .get('/api/jobs/testusername/cards')
          .expect(404, { error: { message: 'User not found' } });
      });
    });

    context('Given users in the database, but no cards', () => {
      beforeEach('Insert users', () => {
        return db.into('workwork_users').insert(testUsers);
      });

      it('Responds with a 200 and no content', () => {
        return supertest(app).get('/api/jobs/jkrakz/').expect(200);
      });
    });

    context('Given there are users and cards in the database', () => {
      beforeEach('Insert users and cards', () => {
        return db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('workwork_jobcards')
              .insert(testCards)
              .then(() => {
                return db
                  .into('workwork_jobcontacts')
                  .insert(testContacts)
                  .then(() => {
                    return db.into('workwork_jobevents').insert(testEvents);
                  });
              });
          });
      });
      it('Responds with an array of objects', () => {
        return supertest(app).get('/api/jobs/jkrakz').expect(200, jobCardsState);
      });
    });
  });
});
