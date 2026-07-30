import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { relations } from './relations.js';

config({ path: '.env.local'})

const sql = neon(process.env.DATABASE_URL!);

export const postgres = drizzle({client: sql, relations });
