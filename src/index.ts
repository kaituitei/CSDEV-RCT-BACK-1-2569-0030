import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { ENV } from './type.js'
import test from "./api/test.js"
import login from "./api/auth/login.js"
import register from  "./api/auth/register.js"
import postItem from "./api/items/items.post.js"
import getById from './api/items/items.getId.js'
import getItem from './api/items/items.get.js'
import getImage from './api/items/items.getImage.js'
import deleteItem from './api/items/items.delete.js'
import { jwtExpireCheck } from './middleware/jwtExpireCheck.js'
import getMeItem from './api/items/items.getMeItem.js'

const app = new Hono<ENV>();

app.onError((err, c) => {
	console.error(err);
	return c.json({ error: "Internal server error" }, 500);
});

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

const authRoute = new Hono();
authRoute.route('/login', login);
authRoute.route('/register', register);

app.route('/api/auth', authRoute);

const itemRoute = new Hono<ENV>();
itemRoute.route('/', getItem);
itemRoute.route('/', getById);
itemRoute.route('/', postItem);
itemRoute.route('/', getImage);
itemRoute.route('/', deleteItem);

app.route('/api/items', itemRoute);

app.route('/api/user/@me/items', getMeItem);

serve(app, (info) => (console.log(`Server running on http://localhost:${info.port}`)))