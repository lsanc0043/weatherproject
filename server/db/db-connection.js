import pgPromise from "pg-promise";
import { config } from "dotenv";
config();

const pgp = pgPromise({});
const db = pgp(process.env.DB_URL);

export default db;
