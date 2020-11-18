const StateService = {
  getUserCards(knex, userId) {
    return knex.from('workwork_studycards').select('*').where('user_id', userId);
  },
  getUserById(knex, username) {
    return knex.from('workwork_users').select('id').where('username', username).first();
  },
  getCardEvents(knex, cardsArray) {
    return knex.from('workwork_studyevents').select('*').whereIn('card_id', cardsArray);
  },
};

module.exports = StateService;
