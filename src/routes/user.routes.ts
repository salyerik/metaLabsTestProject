import * as express from 'express';
import { authentication } from '../middleware/authentication';
import { UserController } from '../controllers/user-controller';
import { AuthController } from '../controllers/auth-controller';
const Router = express.Router();

Router.get('/users', authentication, UserController.getUsers);
Router.get('/profile', authentication, AuthController.getProfile);
Router.post('/signup', AuthController.signup);
Router.post('/login', AuthController.login);
Router.put('/update/:id', authentication, UserController.updateUser);
Router.delete('/delete/:id', authentication, UserController.deleteUser);
export { Router as userRouter };
