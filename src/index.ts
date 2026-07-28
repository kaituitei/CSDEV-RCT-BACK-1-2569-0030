import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { ENV } from './type.js'
import test from "./api/test.js"
import login from "./api/auth/login.js"
import register from  "./api/auth/register.js"
import items from "./api/items/items.js"
import { jwtExpireCheck } from './middleware/jwtExpireCheck.js'

const app = new Hono<ENV>();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app
	.use('/api/items', jwt({secret: process.env.JWT_SECRET!, alg: 'HS256', }), jwtExpireCheck)
	.use('/api/items/:id', jwt({secret: process.env.JWT_SECRET!, alg: 'HS256', }), jwtExpireCheck)
	.use('/api/items/:id/image', jwt({secret: process.env.JWT_SECRET!, alg: 'HS256', }), jwtExpireCheck)
	.use('/api/user/@me/items', jwt({secret: process.env.JWT_SECRET!, alg: 'HS256', }), jwtExpireCheck)
	// force these endpoint to check auth first;

app.route('/api/test', test);

app.route('/', login);
app.route('/', register);

app.route('/', items);

serve(app, (info) => (console.log(`Server running on http://localhost:${info.port}`)))