import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'
import { Hono } from 'hono'
import { eq, and, or, ilike } from 'drizzle-orm'
import type { ENV } from '../../type.js'
import { createNotice, getNoticeByFilter, getNoticeById, uploadImage } from '../../services/notice.service.js';
import { notice } from '../../db/schema/notice.js'
import { CONFIG, ERR_PARMS } from '../../constants.js'

const items = new Hono<ENV>();

const postScheme = z.object({
	title: z.string().min(1, ERR_PARMS.NULL_TITLE),
	type: z.enum(['LOST', 'FOUND'], ERR_PARMS.NULL_TYPE),
	description: z.string().min(1, ERR_PARMS.NULL_DESC),
	location: z.string().min(1, ERR_PARMS.NULL_LOC),
	evenDate: z.string().min(1, ERR_PARMS.NULL_DATE),
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
			title: body.title,
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

const queryScheme = z.object({
	search: z.string().trim().max(CONFIG.MAX_CHAR, ERR_PARMS.EXCEED_MAX_CHAR).optional(),
	status: z.enum(['OPEN', 'CLOSE'], ERR_PARMS.INVALID_STATUS).optional(),
	type: z.enum(['LOST', 'FOUND'], ERR_PARMS.INVALID_TYPE).optional(),
	page: z.coerce.number().int().positive(ERR_PARMS.NEGATIVE_PAGE).default(CONFIG.DEFAULT_PAGE),
	pageSize: z.coerce.number().int().positive(ERR_PARMS.INVALID_PAGESIZE)
						.max(CONFIG.PAGE_SIZE_MAX, ERR_PARMS.EXCEED_MAX_PAGESIZE).default(CONFIG.DEFAULT_PAGE_SIZE),
	evenDate: z.iso.date(ERR_PARMS.INVALID_DATE).optional(),
});

items.get('api/items', zValidator('query', queryScheme), async (c) => {
	const { search, status, page, pageSize, type , evenDate } = c.req.valid('query');

	const conditions = [
		search ? or(ilike(notice.title, `%${search}%`),
					ilike(notice.description, `%${search}%`),
					ilike(notice.location, `%${search}%`)
				) 
				: undefined,
		status ? eq(notice.status, status) : undefined,
		type ? eq(notice.type, type) : undefined
	].filter(Boolean);

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	/*
		This is not part of project. Just for understanding of dev himself.

		Database quesry. Case GET /notices?search=item&type=LOST&status=OPEN&page=2&pageSize=10
		SELECT * FROM notices
		WHERE
		(title ILIKE '%item%' OR description '%item%' OR location '%item')
		AND type = 'LOST'
		AND status = 'OPEM'
		ORDER BY createdAt DESC
		LIMIT 10 OFFSET 10;

		SELECT COUNT(*) AS total FROM notices
		WHERE
		(title ILIKE '%item%' OR description ILIKE '%item%' OR location '%item%')
		AND category = 'academic'
		AND status = 'published';
	*/

	const offset = (page - 1) * pageSize;

	const { data, total } = await getNoticeByFilter(whereClause, pageSize, offset, search);

	return (c.json({
		data,
		meta: {
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		},
	}));
});

items.get('/api/items/:id', async (c) => {
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
})

export default (items);