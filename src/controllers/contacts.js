import {
  deleteContact,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';
import { getContactsById } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { createContact } from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactsById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const creationContact = async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      404,
      'Name, phoneNumber and contactType are required',
    );
  }

  const newContact = {
    name,
    phoneNumber,
    email: email || '',
    isFavourite: isFavourite || false,
    contactType,
  };

  const addContact = createContact(newContact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: addContact,
  });
};

export const contactDelete = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};

export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const changingContact = {
    ...(name && { name }),
    ...(phoneNumber && { phoneNumber }),
    ...(email && { email }),
    ...(isFavourite !== undefined && { isFavourite }),
    ...(contactType && { contactType }),
  };
  const contactChange = updateContact(contactId, changingContact);

  if (!contactChange) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contactChange.contact,
  });
};