const EventService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  getUserCards(knex, userId) {
    return knex.from('workwork_jobcards').select('*').where('user_id', userId);
  },
  getSingleCardEvent(knex, cardId) {
    return knex.from('workwork_jobevents').select('*').where('card_id', cardId);
  },
  getCardEvents(knex, cardsArray) {
    return knex.from('workwork_jobevents').select('*').whereIn('card_id', cardsArray);
  },
  getCardContacts(knex, cardsArray) {
    return knex.from('workwork_jobcontacts').select('*').whereIn('card_id', cardsArray);
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
  getCardById(knex, cardId) {
    return knex.from('workwork_jobcards').select('*').where('id', cardId).first();
  },
  deleteCard(knex, id) {
    return knex('workwork_jobcards').where({ id }).delete();
  },
};

module.exports = EventService;
