import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';

export class UserController {
	static async getUsers(req: Request, res: Response) {
		const userRepository = AppDataSource.getRepository(User);
		const users = await userRepository.find();
		return res.status(200).json(users);
	}
	static async updateUser(req: Request, res: Response) {
		const id = req.params.id;
		const { name, email } = req.body;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({ where: { id } });
		user.name = name ? name : user.name;
		user.email = email ? email : user.email;
		await userRepository.save(user);
		res.status(200).json({ message: 'User has been updated', user });
	}

	static async deleteUser(req: Request, res: Response) {
		const id = req.params.id;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({ where: { id } });
		await userRepository.remove(user);
		res.status(200).json({ message: 'User has been deleted' });
	}
}
