import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { ENV } from '../src/type.js'
import test from "./test.js"
import login from "../src/auth/login.js"
import register from  "../src/auth/register.js"
import postItem from "../src/items/items.post.js"
import getById from '../src/items/items.getId.js'
import getItem from '../src/items/items.get.js'
import getImage from '../src/items/items.getImage.js'
import deleteItem from '../src/items/items.delete.js'
import updateItem from '../src/items/items.update.js'
import { jwtExpireCheck } from '../src/middleware/jwtExpireCheck.js'
import getMeItem from '../src/items/items.getMeItem.js'
import { HTTPException } from 'hono/http-exception'
import openApiDoc from '../src/doc.js'
import { swaggerUI } from '@hono/swagger-ui'

export const config = { runtime: 'nodejs' };

const app = new Hono<ENV>();

app.onError((err, c) => {
	if (err instanceof HTTPException)
		return (c.json({ error: err.message, status: err.status}, err.status));
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
itemRoute.route('/', updateItem);

app.route('/api/items', itemRoute);

app.route('/api/user/@me/items', getMeItem);

app.get('/doc', (c) => c.json(openApiDoc))

app.get('/ui', swaggerUI({ url: '/doc' }));

serve(app, (info) => (console.log(`Server running on http://localhost:${info.port}`)))

export default (app);