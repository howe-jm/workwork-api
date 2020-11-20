/* eslint-disable quotes */
require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');

describe('Job Cards endpoints', function () {
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
  describe('GET /api/jobs/:username/cards', () => {
    context('Given a non-existent user', () => {
      it('GET Returns a 404 and message', () => {
        return supertest(app)
          .get('/api/jobs/testusername/cards')
          .expect(404, { error: { message: 'User not found' } });
      });
    });

    context('Given users in the database, but no cards', () => {
      const testUsers = makeUsersArray();
      beforeEach('Insert users in to the database', () =>
        db.into('workwork_users').insert(testUsers)
      );

      it('GET Returns a 403', () => {
        return supertest(app).get('/api/jobs/jkrakz/cards').expect(403);
      });
    });

    context('Given there are users and cards in the database', () => {
      const testUsers = makeUsersArray();
      const testJobCards = makeJobCardsArray();

      beforeEach('Insert Users and Cards in to the database', () =>
        db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => db.into('workwork_jobcards').insert(testJobCards))
      );

      it('GET returns a 403', () => {
        return supertest(app).get('/api/jobs/jkrakz/cards').expect(403);
      });
    });
  });

  describe('POST /api/jobs/:username/cards', () => {
    context('Given a non-existent user', () => {
      it('GET Returns a 404 and message', () => {
        return supertest(app)
          .get('/api/jobs/testusername/cards')
          .expect(404, { error: { message: 'User not found' } });
      });
    });

    context('Given a valid user', () => {
      const testUsers = makeUsersArray();
      beforeEach(() => db.into('workwork_users').insert(testUsers));

      it('Rejects cards with improper data', () => {
        const badTestCard = {
          user_id: 1,
          companyName: '',
          jobTitle: 'Test Title',
          jobUrl: 'http://www.testurl.com',
        };

        return supertest(app)
          .post('/api/jobs/jkrakz/cards')
          .send(badTestCard)
          .expect(400, { error: { message: `Missing 'companyname' in request body` } });
      });

      it('Responds with a 201 and location of valid new cards', () => {
        const testCard = {
          user_id: 1,
          companyName: 'Test Company',
          jobTitle: 'Test Title',
          jobUrl: 'http://www.testurl.com',
        };

        return supertest(app)
          .post('/api/jobs/jkrakz/cards')
          .send(testCard)
          .expect(201)
          .expect((res) => {
            expect(res.body.companyName).to.eql(testCard.companyName);
            expect(res.body.jobTitle).to.eql(testCard.jobTitle);
            expect(res.body.jobUrl).to.eql(testCard.jobUrl);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(`/api/jobs/jkrakz/cards/${res.body.id}`);
          });
      });
    });
  });

  describe('DELETE /api/jobs/:username/cards', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();

    beforeEach('Insert Users in to the database', () =>
      db.into('workwork_users').insert(testUsers)
    );

    context('Given no cards or a non-existent card', () => {
      it('Responds with a 404 error', () => {
        return supertest(app)
          .delete('/api/jobs/jkrakz/cards/3322')
          .expect(404, { error: { message: 'Card not found' } });
      });
    });

    context('Given a valid card', () => {
      beforeEach('Insert Cards in to the database', () =>
        db.into('workwork_jobcards').insert(testCards)
      );

      it('Responds with a 204', () => {
        return supertest(app).delete('/api/jobs/jkrakz/cards/2').expect(204);
      });
    });
  });

  describe('PATCH /api/jobs/:username/cards', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();

    const badCard = {
      user_id: 1,
      companyName: '',
      jobTitle: 'Test Title',
      jobUrl: 'http://www.testurl.com',
    };

    const patchCard = {
      user_id: 1,
      companyName: 'Test Company',
      jobTitle: 'Test Title',
      jobUrl: 'http://www.testurl.com',
    };

    beforeEach('Insert Users in to the database', () =>
      db.into('workwork_users').insert(testUsers)
    );

    context('Given no cards or a non-existent card', () => {
      it('Responds with a 404', () => {
        return supertest(app)
          .patch('/api/jobs/jkrakz/cards/1234')
          .send(patchCard)
          .expect(404, { error: { message: 'Card not found' } });
      });
    });

    context('Given a valid card but invalid patch data', () => {
      beforeEach('Insert Cards in to the database', () =>
        db.into('workwork_jobcards').insert(testCards)
      );

      it('Responds with a 400 and message', () => {
        return supertest(app)
          .patch('/api/jobs/jkrakz/cards/2')
          .send(badCard)
          .expect(400, { error: { message: `Missing 'companyname' in request body` } });
      });
    });

    context('Given a valid card and valid patch data', () => {
      beforeEach('Insert Cards in to the database', () =>
        db.into('workwork_jobcards').insert(testCards)
      );

      it('Responds with a 200 and the edited card', () => {
        return supertest(app)
          .patch('/api/jobs/jkrakz/cards/2')
          .send(patchCard)
          .expect(200)
          .expect((res) => {
            expect(res.body.companyName).to.eql(patchCard.companyName);
            expect(res.body.jobTitle).to.eql(patchCard.jobTitle);
            expect(res.body.jobUrl).to.eql(patchCard.jobUrl);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(`/api/jobs/jkrakz/cards/${res.body.id}`);
          });
      });
    });
  });
});
