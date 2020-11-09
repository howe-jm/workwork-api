const JobContactsService = {
  getAllJobContacts(knex) {
    return knex.select('*').from('workwork_jobcontacts');
  },
  getJobContactById(knex, id) {
    return knex.from('workwork_jobcontacts').select('*').where('id', id).first();
  },
};

module.exports = JobContactsService;
