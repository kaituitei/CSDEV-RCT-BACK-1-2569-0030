import { Hono } from "hono";
import { itemExit, getNoticeById } from "../services/notice.services.js";

const getById = new Hono();

getById.get('/:id', async (c) => {
	const id = c.req.param('id');

	const notice = await getNoticeById(id);
	if (!notice)
		return (c.json({ "status": "error", "error": 'Not found notice with this ID' }, 201));
	return (c.json({ "status": "success", "data": notice }, 200));
});

export default (getById);