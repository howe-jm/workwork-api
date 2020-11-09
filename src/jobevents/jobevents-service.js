const JobEventsService = {
  getAllJobEvents(knex) {
    return knex.select('*').from('workwork_jobevents');
  },
  getJobEventById(knex, id) {
    return knex.from('workwork_jobevents').select('*').where('id', id).first();
  },
  deleteEvent(knex, id) {
    return knex('workwork_jobevents').where({ id }).delete();
  },
};

module.exports = JobEventsService;
