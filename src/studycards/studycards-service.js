const StudyCardsService = {
  getUserById(knex, username) {
    return knex.from('workwork_users').select('id').where('username', username).first();
  },
  getCardById(knex, cardId) {
    return knex.from('workwork_studycards').select('*').where('id', cardId).first();
  },
  deleteCard(knex, id) {
    return knex('workwork_studycards').where({ id }).delete();
  },
  insertCard(knex, newCard) {
    return knex
      .insert(newCard)
      .into('workwork_studycards')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  updateCard(knex, id, newCard) {
    return knex('workwork_studycards')
      .where({ id })
      .update(newCard)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = StudyCardsService;
