import {
  deleteContact,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';
import { getContactsById } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { createContact } from '../services/contacts.js';
import { parsePagination } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePagination(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    id: req.user._id,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const { _id: userId } = req.user;

  const contact = await getContactsById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact with id ${contactId}!',
    data: contact,
  });
};

export const creationContact = async (req, res, next) => {
  const userId = req.user._id;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name && !phoneNumber && !contactType) {
    throw createHttpError(
      404,
      'Name, phoneNumber and contactType are required',
    );
  }

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const newContact = {
    name,
    phoneNumber,
    email: email || '',
    isFavourite: isFavourite || false,
    contactType,
    photo: photoUrl,
  };

  const savedContact = await createContact(userId, newContact);
  res.status(201).json(savedContact);
};

export const contactDelete = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const contact = await deleteContact(contactId, _id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;
  const { _id } = req.user;

  let photoUrl;

  if (photo) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const changingContact = {
    ...(name && { name }),
    ...(phoneNumber && { phoneNumber }),
    ...(email && { email }),
    ...(isFavourite !== undefined && { isFavourite }),
    ...(contactType && { contactType }),
    photo: photoUrl,
  };
  const contactChange = await updateContact(contactId, changingContact, _id);

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
