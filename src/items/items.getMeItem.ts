import { Hono } from "hono";
import type { ENV } from "../type.js";
import { getUserNotice } from "../services/notice.services.js";

const getMeItem = new Hono<ENV>();

getMeItem.get('/', async (c) => {
	console.log('api route correctly')
	const payload = c.get('jwtPayload');

	const noticeList = await getUserNotice(payload.userId);
	if (!noticeList)
		return (c.json({ error: "This user haven't create notice yet" }, 201));
	return (c.json({ listItem: noticeList}));
});

export default (getMeItem);