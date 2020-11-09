const StudyEventsService = {
  getAllStudyEvents(knex) {
    return knex.select('*').from('workwork_studyevents');
  },
  getStudyEventById(knex, id) {
    return knex.from('workwork_studyevents').select('*').where('id', id).first();
  },
};

module.exports = StudyEventsService;
