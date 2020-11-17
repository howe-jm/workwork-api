const JobCardsService = {
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
  updateCard(knex, id, newCard) {
    return knex('workwork_jobcards')
      .where({ id })
      .update(newCard)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = JobCardsService;
