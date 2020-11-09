const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  firstname: xss(user.firstname),
  lastname: xss(user.lastname),
  username: xss(user.username),
  password: xss(user.password),
  date_created: user.date_created,
});

usersRouter.route('/').get((req, res, next) => {
  UsersService.getAllUsers(req.app.get('db'))
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).json({
          error: { message: 'No users' },
        });
      }
      res.json(users);
    })
    .catch(next);
});

module.exports = usersRouter;
