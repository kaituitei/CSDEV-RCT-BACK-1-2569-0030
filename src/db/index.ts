// import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { relations } from './relations.js';

// config({ path: '.env.local'})

export const postgres = drizzle(process.env.DATABASE_URL!, { relations });
