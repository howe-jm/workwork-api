/* eslint-disable quotes */
require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeJobEventsArray } = require('./fixtures/jobevents.fixtures');
const { makeJobEventsJson } = require('./fixtures/jobevents.json');

describe('Job Card Events endpoints', function () {
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
      'TRUNCATE workwork_jobevents, workwork_jobevents, workwork_jobcards, workwork_users RESTART IDENTITY CASCADE;'
    )
  );

  afterEach('Clean the table', () =>
    db.raw(
      'TRUNCATE workwork_jobevents, workwork_jobevents, workwork_jobcards, workwork_users RESTART IDENTITY CASCADE;'
    )
  );

  describe('ALL /:user_name/events/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();

    context('Given non-existent user or users', () => {
      it('Responds with a 404', () => {
        return supertest(app)
          .get('/api/jobs/testuser/events/2')
          .expect(404, { error: { message: 'User not found' } });
      });
    });
    context('Given a valid user, but no cards', () => {
      beforeEach(() => db.into('workwork_users').insert(testUsers));
      it('Responds with a 204 and no content', () => {
        return supertest(app).get('/api/jobs/jkrakz/events/2').expect(204);
      });
    });

    context('Given a valid user and card, but no events', () => {
      beforeEach(() =>
        db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => db.into('workwork_jobcards').insert(testCards))
      );
      it('Responds with a 204 and no content', () => {
        return supertest(app).get('/api/jobs/jkrakz/events/2').expect(204);
      });
    });
  });

  describe('GET /:user_name/events/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testEvents = makeJobEventsArray();
    const testEventsJson = makeJobEventsJson();

    before(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobevents').insert(testEvents))
        )
    );

    context('Given a valid user and a card with events', () => {
      it('Responds with 200 and the events for the card', () => {
        return supertest(app)
          .get('/api/jobs/jkrakz/events/2')
          .expect(200, testEventsJson);
      });
    });
  });

  describe('POST /:user_name/events/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testEvents = makeJobEventsArray();

    beforeEach(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobevents').insert(testEvents))
        )
    );

    context('Given a valid user and invalid new event', () => {
      const badEvent = {
        jobUrl: 'http://www.badurl.com/',
      };
      it('Returns a 400 and message', () => {
        return supertest(app)
          .post('/api/jobs/jkrakz/events/2')
          .send(badEvent)
          .expect(400, { error: { message: `Missing 'eventtype' in request body` } });
      });
    });

    context('Given a value user and valid event', () => {
      const testEvent = {
        eventType: 'Test Name',
      };

      it('Returns a 201 and the new event and location', () => {
        return supertest(app)
          .post('/api/jobs/jkrakz/events/2')
          .send(testEvent)
          .expect(201)
          .expect((res) => {
            expect(res.body.eventName).to.eql(testEvent.eventName);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(
              `/api/jobs/jkrakz/events/2/${res.body.id}`
            );
          });
      });
    });
  });

  describe('DELETE /api/jobs/:username/events/update/:event_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testEvents = makeJobEventsArray();

    beforeEach(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobevents').insert(testEvents))
        )
    );

    context('Given a valid event', () => {
      it('Responds with a 204', () => {
        return supertest(app).delete('/api/jobs/jkrakz/events/update/1').expect(204);
      });
    });
  });
});
