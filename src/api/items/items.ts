import { zValidator } from '@hono/zod-validator';
import { success, z } from 'zod'
import { Hono } from 'hono'
import type { ENV } from '../../type.js'
import { createNotice, uploadImage } from '../../services/notice.service.js';

const items = new Hono<ENV>();

const postScheme = z.object({
	title: z.string().min(1, "Title is required"),
	type: z.enum(['LOST', 'FOUND']),
	description: z.string().min(1, "Description is required"),
	location: z.string().min(1, "Lost location is required"),
	evenDate: z.string().min(1, "Even data is required"),
	image: z.instanceof(File).optional(),
});

items.post('/api/items', zValidator('form', postScheme), async (c) => {
	try {
		const payload = c.get('jwtPayload');
		const body = c.req.valid('form');

		const imageUrl = await uploadImage(body.image);
		const userId = payload.userId;
		const owner = payload.username;

		const newNotice = await createNotice({
			userId: userId,
			type: body.type,
			description: body.description,
			location: body.location,
			evenDate: body.evenDate,
			image: imageUrl,
			owner: owner,
		});

		return (c.json({ success: true, data: newNotice }, 201));
	}
	catch (error) {
		console.error("Notice creation error:", error);

		// Catch validation or upload errors gracefully
		const errorMessage = error instanceof Error ? error.message : "Failed to create notice";
		return c.json({ success: false, message: errorMessage }, 400);
	}
});

export default (items);