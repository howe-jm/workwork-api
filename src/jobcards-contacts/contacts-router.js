/* eslint-disable eqeqeq */
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
        if (contacts == false) {
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
      card_id,
    };

    for (const [key, value] of Object.entries(newContact)) {
      if (value == null || value === '') {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (!contactNumber || contactNumber === '' || !contactEmail || contactEmail === '') {
      return res
        .status(400)
        .json({ error: { message: 'Must have either phone number or e-mail address.' } });
    }

    newContact.contactnumber = contactNumber;
    newContact.contactemail = contactEmail;

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
  .route('/:user_name/contacts/update/:contact_id')
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
  })
  .patch(jsonParser, (req, res, next) => {
    const { contactName, contactTitle, contactNumber, contactEmail } = req.body;
    const updatedContact = {
      id: req.params.contact_id,
      contactname: contactName,
      contacttitle: contactTitle,
    };
    for (const [key, value] of Object.entries(updatedContact)) {
      if (value == null || value === '') {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    if (!contactNumber || contactNumber === '' || !contactEmail || contactEmail === '') {
      return res
        .status(400)
        .json({ error: { message: 'Must have either phone number or e-mail address.' } });
    }

    updatedContact.contactnumber = contactNumber;
    updatedContact.contactemail = contactEmail;

    ContactsService.updateContact(
      req.app.get('db'),
      req.params.contact_id,
      updatedContact
    )
      .then((contact) => {
        return res
          .status(200)
          .location(path.posix.join(req.originalUrl))
          .json(serializeJobContact(contact));
      })
      .catch(next);
  });

module.exports = jobContactsRouter;
