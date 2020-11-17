const JobCardsService = {
  getUserCards(knex, userId) {
    return knex.from('workwork_jobcards').select('*').where('user_id', userId);
  },
  getUserById(knex, username) {
    return knex.from('workwork_users').select('id').where('username', username).first();
  },
  getCardById(knex, cardId) {
    return knex.from('workwork_jobcards').select('*').where('id', cardId).first();
  },
  deleteCard(knex, id) {
    return knex('workwork_jobcards').where({ id }).delete();
  },
  insertCard(knex, newCard) {
    return knex
      .insert(newCard)
      .into('workwork_jobcards')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getCardEvents(knex, cardsArray) {
    return knex.from('workwork_jobevents').select('*').whereIn('card_id', cardsArray);
  },
  getCardContacts(knex, cardsArray) {
    return knex.from('workwork_jobcontacts').select('*').whereIn('card_id', cardsArray);
  },
};

module.exports = JobCardsService;
