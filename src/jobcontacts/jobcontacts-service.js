const JobContactsService = {
  getAllJobContacts(knex) {
    return knex.select('*').from('workwork_jobcontacts');
  },
};

module.exports = JobContactsService;
