import * as express from 'express';
import * as dotenv from 'dotenv';

import { AppDataSource } from './data-source';
import { userRouter } from './routes/user.routes';

dotenv.config();

const { PORT = 3030 } = process.env;
const app = express();

app.use(express.json());
app.use('/auth', userRouter);

AppDataSource.initialize()
	.then(async () => {
		app.listen(PORT, () => {
			console.log('Server is running on http://localhost:' + PORT);
		});
	})
	.catch(error => console.log(error.message));
