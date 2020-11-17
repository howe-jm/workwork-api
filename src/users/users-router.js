const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  firstName: xss(user.firstname),
  lastName: xss(user.lastname),
  userName: xss(user.username),
  dateCreated: user.date_created,
});

usersRouter
  .route('/')
  .get((req, res, next) => {
    UsersService.getUsers(req.app.get('db'))
      .then((users) => {
        if (users.length === 0) {
          return res.status(404).json({ error: { message: 'Users not found' } });
        }
        res.json(users.map((user) => serializeUser(user)));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { firstName, lastName, userName } = req.body;
    const newUser = {
      firstname: firstName,
      lastname: lastName,
      username: userName,
      password: 'testplaceholderpassword',
    };

    for (const [key, value] of Object.entries(newUser)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    UsersService.insertUser(req.app.get('db'), newUser)
      .then((user) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.name}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

usersRouter
  .route('/:user_name')
  .all((req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get('db'), req.params.user_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
