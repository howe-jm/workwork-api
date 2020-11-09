require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeJobCardsArray } = require('./fixtures/jobcards.fixtures');
const { makeUsersArray } = require('./fixtures/users.fixtures');
const { makeJobContactsArray } = require('./fixtures/jobcontacts.fixtures');

describe('Job Contacts Endpoints', () => {
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
      'TRUNCATE workwork_jobcards, workwork_users, workwork_jobcontacts RESTART IDENTITY CASCADE'
    )
  );

  afterEach('Cleanup the tables', () =>
    db.raw(
      'TRUNCATE workwork_jobcards, workwork_users, workwork_jobcontacts RESTART IDENTITY CASCADE'
    )
  );

  describe('GET /api/jobcontacts', () => {
    context('Given no contacts', () => {
      it('Returns a 404 error', () => {
        return supertest(app)
          .get('/api/jobcontacts')
          .expect(404, { error: { message: 'No job contacts' } });
      });
    });
  });
  context('Given there are Contacts in the db', () => {
    const testUsers = makeUsersArray();
    const testCards = makeJobCardsArray();
    const testContacts = makeJobContactsArray();

    beforeEach('Insert users', () => {
      return db
        .into('workwork_users')
        .insert(testUsers)
        .then(() => {
          return db.into('workwork_jobcards').insert(testCards);
        })
        .then(() => {
          return db.into('workwork_jobcontacts').insert(testContacts);
        });
    });
    it('Responds with 200 and all of the Contacts', () => {
      return supertest(app).get('/api/jobcontacts').expect(200, testContacts);
    });
  });

  describe('GET /api/jobcontacts/:contact_id', () => {
    context('Given no contacts', () => {
      it('Returns a 404 error', () => {
        const contactId = 3;
        return supertest(app)
          .get(`/api/jobcontacts/${contactId}`)
          .expect(404, { error: { message: 'Contact not found' } });
      });
    });
    context('Given contacts in the database', () => {
      const testUsers = makeUsersArray();
      const testCards = makeJobCardsArray();
      const testContacts = makeJobContactsArray();

      beforeEach('Insert events', () => {
        return db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => {
            return db.into('workwork_jobcards').insert(testCards);
          })
          .then(() => {
            return db.into('workwork_jobcontacts').insert(testContacts);
          });
      });
      it('Returns the specified contacts', () => {
        const contactId = 3;
        const expectedContact = testContacts[contactId - 1];
        return supertest(app)
          .get(`/api/jobcontacts/${contactId}`)
          .expect(200, expectedContact);
      });
    });
  });
  describe('DELETE /api/jobcontacts/:contact_id', () => {
    context('Given no contact', () => {
      it('Returns a 404 error', () => {
        const eventId = 3;
        return supertest(app)
          .delete(`/api/jobcontacts/${eventId}`)
          .expect(404, { error: { message: 'Contact not found' } });
      });
    });
    context('Given contacts in the database', () => {
      const testUsers = makeUsersArray();
      const testCards = makeJobCardsArray();
      const testContacts = makeJobContactsArray();

      beforeEach('Insert contact', () => {
        return db
          .into('workwork_users')
          .insert(testUsers)
          .then(() => {
            return db.into('workwork_jobcards').insert(testCards);
          })
          .then(() => {
            return db.into('workwork_jobcontacts').insert(testContacts);
          });
      });
      it('Returns 204 and removes the contact', () => {
        const contactId = 3;
        const expectedContact = testContacts.filter(
          (contact) => contact.id !== contactId
        );
        return supertest(app)
          .delete(`/api/jobcontacts/${contactId}`)
          .expect(204)
          .then(() => {
            return supertest(app).get('/api/jobcontacts').expect(expectedContact);
          });
      });
    });
  });
});
