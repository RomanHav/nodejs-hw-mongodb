import { Router } from 'express';
import contactRouter from './contacts.js';
import authRouter from './auth.js';

const mainRouter = Router();
mainRouter.use('/contacts', contactRouter);
mainRouter.use('/auth', authRouter);

export default mainRouter;
