import { SORT_ORDER } from '../constants/index.js';
import Contact from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
  id,
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactQuery = Contact.find({ userId: id });

    if (filter.type) {
      contactQuery.where('contactType').equals(filter.type);
    }
    if (typeof filter.isFavourite === 'boolean') {
      contactQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const contactsCount = await Contact.find({ userId: id })
      .merge(contactQuery)
      .countDocuments();

    const contacts = await contactQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    const paginationData = calculatePaginationData(
      contactsCount,
      page,
      perPage,
    );

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
};

export const getContactsById = async (contactId, userId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Failed to fetch contact');
  }
};

export const createContact = async (userId, payload) => {
  try {
    const newContact = await Contact.create({ userId: userId, ...payload });
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId,
    });
    if (!deletedContact) {
      throw new Error('Contact not found');
    }
    return deletedContact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      payload,
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
    if (!updatedContact) return null;

    return {
      contact: updatedContact,
      isNew: Boolean(updatedContact?.lastErrorObject?.upserted),
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
};
