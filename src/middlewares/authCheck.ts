import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt';

export async function authCheck(c: Context, next: Next) {
	const authHeader = await c.req.header('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer '))
		return (c.json({ error: 'Unauthorized' }, 401));

	const token = authHeader.split(' ')[1];
	if (!token)
		return (c.json({ error: 'Missing token' }, 401))

	const user =  await verify(token!, process.env.JWT_SECRET!, 'HS256');
	if (!user)
		return (c.json({ error: 'Invalid token'}, 401));

	c.set('user', user);
	await next();
};