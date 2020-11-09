const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('workwork_users');
  },
};

module.exports = UsersService;
