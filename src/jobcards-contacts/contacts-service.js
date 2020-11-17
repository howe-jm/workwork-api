const ContactsService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  getSingleCardContact(knex, cardId) {
    return knex.from('workwork_jobcontacts').select('*').where('card_id', cardId);
  },
  getSingleContact(knex, contactId) {
    return knex.from('workwork_jobcontacts').select('*').where('id', contactId);
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
  updateContact(knex, id, newContFields) {
    return knex('workwork_jobcontacts')
      .where({ id })
      .update(newContFields)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getCardById(knex, cardId) {
    return knex.from('workwork_jobcards').select('*').where('id', cardId).first();
  },
  deleteContact(knex, id) {
    return knex('workwork_jobcontacts').where({ id }).delete();
  },
};

module.exports = ContactsService;
