import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export class encrypt {
	static encryptPassword(password: string) {
		return bcrypt.hashSync(password, 4);
	}
	static comparePassword(hashPassword: string, password: string) {
		return bcrypt.compareSync(password, hashPassword);
	}

	static generateToken(payload: { id: string }) {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
	}
}
