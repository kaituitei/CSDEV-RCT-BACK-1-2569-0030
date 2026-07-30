import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { ilike, eq, or, and } from "drizzle-orm";
import { notice } from "../../../db/schema/notice.js";
import { CONFIG, ERR_PARMS } from "../../../constants.js";
import { getNoticeByFilter } from "../../../services/notice.services.js";

const getItem = new Hono();

const queryScheme = z.object({
	search: z.string().trim().max(CONFIG.MAX_CHAR, ERR_PARMS.EXCEED_MAX_CHAR).optional(),
	status: z.enum(['OPEN', 'CLOSE'], ERR_PARMS.INVALID_STATUS).optional(),
	type: z.enum(['LOST', 'FOUND'], ERR_PARMS.INVALID_TYPE).optional(),
	page: z.coerce.number().int().positive(ERR_PARMS.NEGATIVE_PAGE).default(CONFIG.DEFAULT_PAGE),
	pageSize: z.coerce.number().int().positive(ERR_PARMS.INVALID_PAGESIZE)
						.max(CONFIG.PAGE_SIZE_MAX, ERR_PARMS.EXCEED_MAX_PAGESIZE).default(CONFIG.DEFAULT_PAGE_SIZE),
	evenDate: z.iso.date(ERR_PARMS.INVALID_DATE).optional(),
});

getItem.get('/', zValidator('query', queryScheme), async (c) => {
	const { search, status, page, pageSize, type } = c.req.valid('query');

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

export default (getItem);