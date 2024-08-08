import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  creationContact,
  contactDelete,
  patchContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactRouter.post('/contacts', ctrlWrapper(creationContact));

contactRouter.patch('/contacts/:contactId', ctrlWrapper(patchContact));

contactRouter.delete('/contacts/:contactId', ctrlWrapper(contactDelete));

export default contactRouter;
