import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { findUsername, createUser } from '../../services/users.services.js'

const register = new Hono()

const registerSchema = z.object({
	username: z.string(),
	password: z.string().min(8),
})

register.post('/', zValidator('json', registerSchema), async (c) => {
	const { username, password } = c.req.valid('json')

	try {
		const existing = await findUsername(username);

		if (existing)
			return c.json({error: 'This username has been used'}, 409);

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await createUser({ userName: username, passwordHash: passwordHash });

		return (c.json({ id: user?.id, username: user?.userName}, 201));
	}
	catch (err) {
		console.error(err);
		return (c.json({ error: 'Internal server error'}, 500));
	}
});

export default (register);