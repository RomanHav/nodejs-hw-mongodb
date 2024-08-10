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
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const contactRouter = Router();
contactRouter.use(authenticate);
contactRouter.get('/',
  checkRoles(ROLES.ADMIN),
  ctrlWrapper(getContactsController));

contactRouter.get(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.USER),
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/',
  checkRoles(ROLES.ADMIN),
  validateBody(postSchema),
  ctrlWrapper(creationContact),
);

contactRouter.patch(
  '/:contactId',
  checkRoles(ROLES.ADMIN, ROLES.USER),
  validateBody(patchSchema),
  ctrlWrapper(patchContact),
);

contactRouter.delete(
  '/:contactId',
  checkRoles(ROLES.ADMIN),
  isValidId,
  ctrlWrapper(contactDelete),
);

export default contactRouter;
