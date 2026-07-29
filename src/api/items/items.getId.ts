import { Hono } from "hono";
import { getNoticeById } from "../../services/notice.service.js";

const getById = new Hono();

getById.get('/:id', async (c) => {
	try {
		const id = c.req.param('id');

		const notice = await getNoticeById(id);
		if (!notice)
			return (c.json({ "status": "error", "error": 'Not found notice with this ID' }, 201));
		return (c.json({ "status": "success", "data": notice }, 200));
	}
	catch (error) {
		console.error(error);
		return (c.json({ "status": "error", "error": "Internal server fail" }, 500));
	}
});

export default (getById);