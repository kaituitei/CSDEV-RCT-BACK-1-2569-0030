import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";A
import type { ENV } from "../type.js";

export const jwtExpireCheck = createMiddleware<ENV>(async (c, next) => {
	const payload = c.get('jwtPayload');
	const currrentTime = Math.floor(Date.now() / 1000);

	if (payload.expire - currrentTime <= 0)
		throw new HTTPException(401, { message: 'Token has expired' });
	await next();
});