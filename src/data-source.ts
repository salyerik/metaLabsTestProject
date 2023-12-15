import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entity/User.entity';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
	process.env;

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: DB_HOST,
	port: +DB_PORT,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_DATABASE,
	synchronize: false,
	logging: false,
	entities: [User],
	migrations: [__dirname + '/migration/*.ts'],
	subscribers: [],
});
