const JobCardsService = {
  getAllJobCards(knex) {
    return knex.select('*').from('workwork_jobcards');
  },
  getJobCardById(knex, id) {
    return knex.from('workwork_jobcards').select('*').where('id', id).first();
  },
};

module.exports = JobCardsService;
