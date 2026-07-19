import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import test from "./api/test.js"

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.route('/api/test', test)

serve(app, (info) => (console.log(`Server running on http://localhost:${info.port}`)))