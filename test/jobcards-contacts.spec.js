/* eslint-disable quotes */
require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeJobContactsArray } = require('./fixtures/jobcontacts.fixtures');
const { makeJobContactsJson } = require('./fixtures/jobcontacts.json');

describe('Job Card Contacts endpoints', function () {
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

  describe('ALL /:user_name/contacts/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();

    context('Given non-existent user or users', () => {
      it('Responds with a 404', () => {
        return supertest(app)
          .get('/api/jobs/testuser/contacts/2')
          .expect(404, { error: { message: 'User not found' } });
      });
    });
    context('Given a valid user, but no cards', () => {
      beforeEach(() => db.into('workwork_users').insert(testUsers));
      it('Responds with a 204 and no content', () => {
        return supertest(app).get('/api/jobs/jkrakz/contacts/2').expect(204);
      });
    });

    context('Given a valid user and card, but no contacts', () => {
      beforeEach(() =>
        db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => db.into('workwork_jobcards').insert(testCards))
      );
      it('Responds with a 204 and no content', () => {
        return supertest(app).get('/api/jobs/jkrakz/contacts/2').expect(204);
      });
    });
  });

  describe('GET /:user_name/contacts/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();
    const testContactsJson = makeJobContactsJson();

    before(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobcontacts').insert(testContacts))
        )
    );

    context('Given a valid user and a card with contacts', () => {
      it('Responds with the contacts for the card', () => {
        return supertest(app)
          .get('/api/jobs/jkrakz/contacts/2')
          .expect(200, testContactsJson);
      });
    });
  });

  describe('POST /:user_name/contacts/:card_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();

    beforeEach(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobcontacts').insert(testContacts))
        )
    );

    context('Given a valid user and invalid new contact', () => {
      const badContact = {
        jobUrl: 'http://www.badurl.com/',
      };
      it('Returns a 400 and message', () => {
        return supertest(app)
          .post('/api/jobs/jkrakz/contacts/2')
          .send(badContact)
          .expect(400, { error: { message: `Missing 'contactname' in request body` } });
      });
    });

    context('Given a value user and valid contact', () => {
      const testContact = {
        contactName: 'Test Name',
        contactTitle: 'Test Title',
        contactNumber: 'Test Number',
        contactEmail: 'Test e-mail',
      };

      it('Returns a 201 and the new contact and location', () => {
        return supertest(app)
          .post('/api/jobs/jkrakz/contacts/2')
          .send(testContact)
          .expect(201)
          .expect((res) => {
            expect(res.body.contactName).to.eql(testContact.contactName);
            expect(res.body.contactTitle).to.eql(testContact.contactTitle);
            expect(res.body.contactNumber).to.eql(testContact.contactNumber);
            expect(res.body.contactEmail).to.eql(testContact.contactEmail);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(
              `/api/jobs/jkrakz/contacts/2/${res.body.id}`
            );
          });
      });
    });
  });

  describe('DELETE /api/jobs/:username/contacts/update/:contact_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();

    beforeEach(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobcontacts').insert(testContacts))
        )
    );

    context('Given a valid contact', () => {
      it('Responds with a 204', () => {
        return supertest(app).delete('/api/jobs/jkrakz/contacts/update/4').expect(204);
      });
    });
  });

  describe('PATCH /api/jobs/:username/contacts/update/:contact_id', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();

    beforeEach(() =>
      db
        .into('workwork_users')
        .insert(testUsers)
        .then(() =>
          db
            .into('workwork_jobcards')
            .insert(testCards)
            .then(() => db.into('workwork_jobcontacts').insert(testContacts))
        )
    );

    context('Given a valid user and invalid updated contact', () => {
      const badContact = {
        jobUrl: 'http://www.badurl.com/',
      };
      it('Returns a 400 and message', () => {
        return supertest(app)
          .patch('/api/jobs/jkrakz/contacts/update/4')
          .send(badContact)
          .expect(400, { error: { message: `Missing 'contactname' in request body` } });
      });
    });

    context('Given a valid user and a valid updated contact', () => {
      const patchContact = {
        contactName: 'Ike Biker PATCH',
        contactTitle: 'CEO',
        contactNumber: '212-444-2022',
        contactEmail: 'testemail@testemail.test',
      };

      it('Returns a 200 and the updated contact and location', () => {
        return supertest(app)
          .patch('/api/jobs/jkrakz/contacts/update/4')
          .send(patchContact)
          .expect(200)
          .expect((res) => {
            expect(res.body.contactName).to.eql(patchContact.contactName);
            expect(res.body.contactTitle).to.eql(patchContact.contactTitle);
            expect(res.body.contactNumber).to.eql(patchContact.contactNumber);
            expect(res.body.contactEmail).to.eql(patchContact.contactEmail);
            expect(res.body).to.have.property('id');
            expect(res.headers.location).to.eql(
              `/api/jobs/jkrakz/contacts/update/${res.body.id}`
            );
          });
      });
    });
  });
});
