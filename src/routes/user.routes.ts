import * as express from 'express';
import { UserController } from '../controllers/user-controller';
import { AuthController } from '../controllers/auth-controller';
import { authentication } from '../middleware/authentication';
import {
	loginValidation,
	registerValidation,
	updateValidation,
} from '../middleware/validation';
const Router = express.Router();

Router.get('/users', authentication, UserController.getUsers);
Router.get('/profile', authentication, AuthController.getProfile);
Router.post('/signup', registerValidation, AuthController.signup);
Router.post('/login', loginValidation, AuthController.login);
Router.put(
	'/update/:id',
	updateValidation,
	authentication,
	UserController.updateUser
);
Router.delete('/delete/:id', authentication, UserController.deleteUser);
export { Router as userRouter };
