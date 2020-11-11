const StateService = {
  getUserCards(knex, userId) {
    return knex.from('workwork_jobcards').select('*').where('user_id', userId);
  },
  getUserById(knex, username) {
    return knex.from('workwork_users').select('id').where('username', username).first();
  },
  getCardEvents(knex, cardsArray) {
    return knex.from('workwork_jobevents').select('*').whereIn('card_id', cardsArray);
  },
  getCardContacts(knex, cardsArray) {
    return knex.from('workwork_jobcontacts').select('*').whereIn('card_id', cardsArray);
  },
};

module.exports = StateService;
