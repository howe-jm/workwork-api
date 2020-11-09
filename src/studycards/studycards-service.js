const StudyCardsService = {
  getAllStudyCards(knex) {
    return knex.select('*').from('workwork_studycards');
  },
};

module.exports = StudyCardsService;
