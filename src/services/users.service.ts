import { postgres } from '../db/index.js'
import { users } from '../db/schema/users.js'
import { eq } from 'drizzle-orm'

export async function findUsername(userName: string) {
	const result = await postgres.select().from(users).where(eq(users.userName, userName));
	return (result[0] ?? null);
};

export async function createUser(data: { userName: string; passwordHash: string; }) {
	const result = await postgres
		.insert(users)
		.values({
			userName: data.userName,
			passwordHash: data.passwordHash,
		})
		.returning() // tell db to send back the row(s) that just inserted
	return (result[0]);
}

export async function getUser(username: string) {
	return (postgres.select().from(users).where(eq(users.userName, username)).limit(1));
}