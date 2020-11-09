const StudyCardsService = {
  getAllStudyCards(knex) {
    return knex.select('*').from('workwork_studycards');
  },
  getStudyCardById(knex, id) {
    return knex.from('workwork_studycards').select('*').where('id', id).first();
  },
};

module.exports = StudyCardsService;
