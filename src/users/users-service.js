const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('workwork_users');
  },
  getUserById(knex, id) {
    return knex.from('workwork_users').select('*').where('id', id).first();
  },
  deleteUser(knex, id) {
    return knex('workwork_users').where({ id }).delete();
  },
};

module.exports = UsersService;
