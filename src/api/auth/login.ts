import { text } from 'drizzle-orm/cockroach-core';
import { Hono } from 'hono'

const login = new Hono()

login.post('/api/auth/login', (c) => {
	return (c.text(`api login route`));
});

export default (login);