import { Hono } from "hono";
import { authCheck } from "../middleware/authCheck.js";
import { deleteNotice } from "../services/notice.services.js";

const deleteItem = new Hono();

deleteItem.delete('/:id', authCheck, async (c) => {
	const id = c.req.param('id');
	const result = await deleteNotice(id);

	return (c.json({ "message": result }, 200));
});

export default (deleteItem);