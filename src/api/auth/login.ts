import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { getUser } from '../../services/users.service.js';
import { compare } from 'bcryptjs'

const login = new Hono()

const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

login.post('/api/auth/login', zValidator('json', loginSchema), async (c) => {
	const { username, password } = c.req.valid('json');

	const [ user ] = await getUser(username);
	if (!user)
		return (c.json({ error: 'Invalid credentials' }, 401));
	
	const isValid = await compare(password, user.passwordHash);
	if (!isValid)
		return (c.json({ error: 'Invalid credentials' }, 401));

	const payload = {
		userId: user.id,
		username: user.userName,
		expire: Math.floor(Date.now() / 1000) + 60 * 5,
	}

	const token = await sign(payload, process.env.JWT_SECRET!);

	return (c.json({ token }));
});

export default (login);