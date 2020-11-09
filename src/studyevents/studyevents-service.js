const StudyEventsService = {
  getAllStudyEvents(knex) {
    return knex.select('*').from('workwork_studyevents');
  },
  getStudyEventById(knex, id) {
    return knex.from('workwork_studyevents').select('*').where('id', id).first();
  },
  deleteEvent(knex, id) {
    return knex('workwork_studyevents').where({ id }).delete();
  },
};

module.exports = StudyEventsService;
