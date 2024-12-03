import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

const pool = createPool({
	host: process.env.HOST,
	port: process.env.PORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

export default pool;