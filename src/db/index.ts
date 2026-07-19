import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations.js';

export const postgres = drizzle(process.env.DATABASE_URL!, { relations });
