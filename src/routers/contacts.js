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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const contactRouter = Router();
contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(postSchema),
  ctrlWrapper(creationContact),
);

contactRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(patchSchema),
  ctrlWrapper(patchContact),
);

contactRouter.delete('/:contactId', isValidId, ctrlWrapper(contactDelete));

export default contactRouter;
