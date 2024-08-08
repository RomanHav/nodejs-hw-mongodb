import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  creationContact,
  contactDelete,
  patchContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { patchSchema, postSchema } from '../validations/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/contacts',
  validateBody(postSchema),
  ctrlWrapper(creationContact),
);

contactRouter.patch(
  '/contacts/:contactId',
  validateBody(patchSchema),
  ctrlWrapper(patchContact),
);

contactRouter.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(contactDelete),
);

export default contactRouter;
