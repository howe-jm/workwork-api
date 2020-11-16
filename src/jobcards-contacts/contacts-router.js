const path = require('path');
const express = require('express');
const xss = require('xss');
const ContactsService = require('./contacts-service');

const jobContactsRouter = express.Router();
const jsonParser = express.json();

const serializeJobContact = (contact) => ({
  id: contact.id,
  contactName: xss(contact.contactname),
  contactNumber: xss(contact.contactnumber),
  contactTitle: xss(contact.contacttitle),
  contactEmail: xss(contact.contactemail),
  dateAdded: contact.contact_added,
  cardId: contact.card_id,
});

jobContactsRouter
  .route('/:user_name/contacts/:card_id')
  .all((req, res, next) => {
    ContactsService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .all((req, res, next) => {
    ContactsService.getCardById(req.app.get('db'), req.params.card_id)
      .then((card) => {
        if (!card) {
          return res.status(204).end();
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .all((req, res, next) => {
    if (res.card.user_id !== res.user.id) {
      return res.status(403).end();
    }
    ContactsService.getSingleCardContact(req.app.get('db'), res.card.id)
      .then((contacts) => {
        if (!contacts) {
          return res.status(204).end();
        }
        res.contacts = contacts;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.contacts.map((contact) => serializeJobContact(contact)));
  })
  .post(jsonParser, (req, res, next) => {
    const { contactName, contactTitle, contactNumber, contactEmail } = req.body;
    const card_id = res.card.id;
    const newContact = {
      contactname: contactName,
      contacttitle: contactTitle,
      contactnumber: contactNumber,
      contactemail: contactEmail,
      card_id,
    };

    for (const [key, value] of Object.entries(newContact)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ContactsService.insertContact(req.app.get('db'), newContact)
      .then((contact) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${contact.id}`))
          .json(serializeJobContact(contact));
      })
      .catch(next);
  });

jobContactsRouter
  .route('/:user_name/contacts/delete/:contact_id')
  .all((req, res, next) => {
    ContactsService.getUserById(req.app.get('db'), req.params.user_name)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found' } });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .all((req, res, next) => {
    ContactsService.getSingleContact(req.app.get('db'), req.params.contact_id)
      .then((contact) => {
        if (!contact) {
          return res.status(404).json({ error: { message: 'Contact not found' } });
        }
        res.contact = contact;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.contact.map((contact) => serializeJobContact(contact)));
  })
  .delete((req, res, next) => {
    ContactsService.deleteContact(req.app.get('db'), req.params.contact_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = jobContactsRouter;
