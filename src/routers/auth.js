import {Router} from 'express';
import { validateBody } from '../middlewares/validateBody';
import { registerUserSchema } from '../validations/auth';
import { ctrlWrapper } from '../middlewares/ctrlWrapper';
import { loginUserController, logoutUserController, refreshUserController, registerUserController } from '../controllers/auth';


const authRoute = Router();

authRoute.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRoute.post('/login', ctrlWrapper(loginUserController));
authRoute.post('/refresh', ctrlWrapper(refreshUserController));
authRoute.post('/logout', ctrlWrapper(logoutUserController));
export default authRoute;
