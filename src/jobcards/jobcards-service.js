const JobCardsService = {
  getAllJobCards(knex) {
    return knex.select('*').from('workwork_jobcards');
  },
};

module.exports = JobCardsService;
