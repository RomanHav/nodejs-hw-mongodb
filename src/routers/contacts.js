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

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post('/', validateBody(postSchema), ctrlWrapper(creationContact));

router.patch(
  '/:contactId',
  validateBody(patchSchema),
  ctrlWrapper(patchContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(contactDelete));

export default router;
