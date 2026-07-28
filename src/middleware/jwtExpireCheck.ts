import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";

export const jwtExpireCheck = createMiddleware(async (c, next) => {
	const payload = c.get('jwtPayload');
	const currrentTime = Math.floor(Date.now() / 1000);

	if (payload.expire - currrentTime <= 0)
		throw new HTTPException(401, { message: 'Token has expired' });
	await next();
});