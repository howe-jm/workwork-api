const JobContactsService = {
  getAllJobContacts(knex) {
    return knex.select('*').from('workwork_jobcontacts');
  },
  getJobContactById(knex, id) {
    return knex.from('workwork_jobcontacts').select('*').where('id', id).first();
  },
  deleteContact(knex, id) {
    return knex('workwork_jobcontacts').where({ id }).delete();
  },
};

module.exports = JobContactsService;
