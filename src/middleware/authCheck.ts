import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { itemExit } from "../services/notice.service.js";

export const authCheck = createMiddleware(async (c, next) => {
	const payload = c.get('jwtPayload');
	const id = c.req.param('id');

	const notice = await itemExit(id!);
	if (!notice)
		throw new HTTPException(400, { message: 'This item ID is not exit' });

	if (notice.userId != payload.userId)
		throw new HTTPException(403, { message: `You don't have auth to this item` });

	await next();
});