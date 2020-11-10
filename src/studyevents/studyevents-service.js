const StudyEventsService = {
  getUserCards(knex, username) {
    let userId = knex
      .from('workwork_users')
      .select('id')
      .where('username', username)
      .first();
    console.log(userId);
  },
};

module.exports = StudyEventsService;
