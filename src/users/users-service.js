const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('workwork_users');
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('workwork_users')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getUserById(knex, id) {
    return knex.from('workwork_users').select('*').where('id', id).first();
  },
};

module.exports = UsersService;
