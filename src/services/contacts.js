import Contact from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const selectContact = await Contact.findById(contactId);
  return selectContact;
};
