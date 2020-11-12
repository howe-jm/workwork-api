const ContactsService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  getUserCards(knex, userId) {
    return knex.from('workwork_jobcards').select('*').where('user_id', userId);
  },
  getSingleCardContact(knex, cardId) {
    return knex.from('workwork_jobcontacts').select('*').where('card_id', cardId);
  },
  getCardContacts(knex, cardsArray) {
    return knex.from('workwork_jobcontacts').select('*').whereIn('card_id', cardsArray);
  },
  insertContact(knex, newContact) {
    return knex
      .insert(newContact)
      .into('workwork_jobcontacts')
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

module.exports = ContactsService;
