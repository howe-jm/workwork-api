const JobCardsService = {
  getAllJobCards(knex) {
    return knex.select('*').from('workwork_jobcards');
  },
  getJobCardById(knex, id) {
    return knex.from('workwork_jobcards').select('*').where('id', id).first();
  },

  deleteCard(knex, id) {
    return knex('workwork_jobcards').where({ id }).delete();
  },
};

module.exports = JobCardsService;
