const StudyCardsService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  getUserCards(knex, userId) {
    return knex.from('workwork_studycards').select('*').where('user_id', userId);
  },
};

module.exports = StudyCardsService;
