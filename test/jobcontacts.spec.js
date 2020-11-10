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
});
