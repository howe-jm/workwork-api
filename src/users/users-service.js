const UsersService = {
  getUsers(knex) {
    return knex.from('workwork_users').select('*');
  },
  getUserById(knex, username) {
    return knex.from('workwork_users').select('*').where('username', username).first();
  },
  deleteUser(knex, id) {
    return knex('workwork_users').where({ id }).delete();
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
};

module.exports = UsersService;
