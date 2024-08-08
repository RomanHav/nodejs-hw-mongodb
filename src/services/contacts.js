import Contact from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const selectContact = await Contact.findById(contactId);
  return selectContact;
};

export const createContact = async (payload) => {
  const postContact = await Contact.create(payload);
  return postContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
  return deletedContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!updatedContact || !updatedContact.value) return null;

  return {
    contact: updatedContact.value,
    isNew: Boolean(updatedContact?.lastErrorObject?.upserted),
  };
};
