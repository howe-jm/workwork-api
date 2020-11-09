const StudyCardsService = {
  getAllStudyCards(knex) {
    return knex.select('*').from('workwork_studycards');
  },
  getStudyCardById(knex, id) {
    return knex.from('workwork_studycards').select('*').where('id', id).first();
  },
  deleteCard(knex, id) {
    return knex('workwork_studycards').where({ id }).delete();
  },
};

module.exports = StudyCardsService;
