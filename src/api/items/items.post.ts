import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'
import { Hono } from 'hono'
import type { ENV } from '../../type.js'
import { createNotice, uploadImage } from '../../services/notice.service.js';
import { ERR_PARMS } from '../../constants.js'

const postItem = new Hono<ENV>();

const postScheme = z.object({
	title: z.string().min(1, ERR_PARMS.NULL_TITLE),
	type: z.enum(['LOST', 'FOUND'], ERR_PARMS.NULL_TYPE),
	description: z.string().min(1, ERR_PARMS.NULL_DESC),
	location: z.string().min(1, ERR_PARMS.NULL_LOC),
	evenDate: z.string().min(1, ERR_PARMS.NULL_DATE),
	image: z.instanceof(File).optional(),
});

postItem.post('/api/items', zValidator('form', postScheme), async (c) => {
	try {
		const payload = c.get('jwtPayload');
		const body = c.req.valid('form');

		const imageUrl = await uploadImage(body.image);
		const userId = payload.userId;
		const owner = payload.username;

		const newNotice = await createNotice({
			title: body.title,
			userId: userId,
			type: body.type,
			description: body.description,
			location: body.location,
			evenDate: body.evenDate,
			image: imageUrl,
			owner: owner,
		});

		return (c.json({ data: newNotice }, 201));
	}
	catch (error) {
		console.error("Notice creation error:", error);

		// Catch validation or upload errors gracefully
		const errorMessage = error instanceof Error ? error.message : "Failed to create notice";
		return c.json({ success: false, message: errorMessage }, 400);
	}
});



export default (postItem);