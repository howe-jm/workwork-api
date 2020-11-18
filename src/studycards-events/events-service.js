const EventService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  getSingleCardEvent(knex, cardId) {
    return knex.from('workwork_studyevents').select('*').where('card_id', cardId);
  },
  getCardEvents(knex, cardsArray) {
    return knex.from('workwork_studyevents').select('*').whereIn('card_id', cardsArray);
  },
  insertEvent(knex, newCard) {
    return knex
      .insert(newCard)
      .into('workwork_studyevents')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getCardById(knex, cardId) {
    return knex.from('workwork_studycards').select('*').where('id', cardId).first();
  },
  deleteEvent(knex, id) {
    return knex('workwork_studyevents').where({ id }).delete();
  },
};

module.exports = EventService;
