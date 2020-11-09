const StudyEventsService = {
  getAllStudyEvents(knex) {
    return knex.select('*').from('workwork_studyevents');
  },
};

module.exports = StudyEventsService;
