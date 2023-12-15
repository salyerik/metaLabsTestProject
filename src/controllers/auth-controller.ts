import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { encrypt } from '../helpers/helpers';
import { validationResult } from 'express-validator';

export class AuthController {
	static async login(req: Request, res: Response) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: errors.array()[0].msg });
			}
			const { email, password } = req.body;

			const userRepository = AppDataSource.getRepository(User);
			const user = await userRepository.findOneBy({ email });
			if (!user) {
				return res.status(404).json({ message: 'User is not found' });
			}
			const isPasswordValid = encrypt.comparePassword(user.password, password);
			if (!isPasswordValid) {
				return res.status(404).json({ message: 'Incorrect password' });
			}
			const token = encrypt.generateToken({ id: user.id });

			return res.status(200).json({
				message: 'Login successful',
				token,
				user: { ...user, password: null },
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async signup(req: Request, res: Response) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: errors.array()[0].msg });
			}
			const { name, email, password } = req.body;

			const userRepository = AppDataSource.getRepository(User);

			const candidate = await userRepository.findOneBy({ email });
			if (candidate) {
				return res
					.status(400)
					.json({ message: `User with email: ${email} already exists` });
			}

			const encryptedPassword = encrypt.encryptPassword(password);
			const user = new User();
			user.name = name;
			user.email = email;
			user.password = encryptedPassword;
			await userRepository.save(user);
			const token = encrypt.generateToken({ id: user.id });

			return res.status(200).json({
				message: 'User created successfully',
				token,
				user: { ...user, password: null },
			});
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
		const user = await userRepository.findOneBy({ id: req['currentUser'].id });
		return res.status(200).json({ ...user, password: undefined });
	}
}
