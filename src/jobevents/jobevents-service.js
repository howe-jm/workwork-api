const JobEventsService = {
  getAllJobEvents(knex) {
    return knex.select('*').from('workwork_jobevents');
  },
};

module.exports = JobEventsService;
