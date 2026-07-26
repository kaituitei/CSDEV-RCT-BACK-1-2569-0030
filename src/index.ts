import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import test from "./api/test.js"
import login from "./api/auth/login.js"
import register from  "./api/auth/register.js"

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!');
})

app.route('/api/test', test);

app.route('/', login);
app.route('/', register);

serve(app, (info) => (console.log(`Server running on http://localhost:${info.port}`)))