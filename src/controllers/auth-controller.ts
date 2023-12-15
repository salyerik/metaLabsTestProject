import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { encrypt } from '../helpers/helpers';

export class AuthController {
	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res
					.status(500)
					.json({ message: 'Email and password are required' });
			}

			const userRepository = AppDataSource.getRepository(User);
			const user = await userRepository.findOne({ where: { email } });

			const isPasswordValid = encrypt.comparePassword(user.password, password);
			if (!user || !isPasswordValid) {
				return res
					.status(404)
					.json({ message: 'User is not found or incorrect password' });
			}
			const token = encrypt.generateToken({ id: user.id });

			return res.status(200).json({ message: 'Login successful', user, token });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async signup(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;
			const encryptedPassword = encrypt.encryptPassword(password);
			const user = new User();
			user.name = name;
			user.email = email;
			user.password = encryptedPassword;
			const userRepository = AppDataSource.getRepository(User);
			await userRepository.save(user);
			const token = encrypt.generateToken({ id: user.id });

			return res
				.status(200)
				.json({ message: 'User created successfully', token, user });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async getProfile(req: Request, res: Response) {
		if (!req['currentUser']) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({
			where: { id: req['currentUser'].id },
		});
		return res.status(200).json({ ...user, password: undefined });
	}
}
