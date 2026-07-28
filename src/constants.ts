import { INVALID } from "zod/v3";

export const CONFIG = {
	DEFAULT_PAGE: 1,
	PAGE_SIZE_MAX: 100,
	DEFAULT_PAGE_SIZE: 10,
	MAX_CHAR: 100,
} as const;

export const ERR_PARMS = {
	NULL_TITLE: `Title is required`,
	NULL_TYPE: `Type is required. Availiable 'LOST' / 'FOUND'`,
	NULL_DESC: `Description is required`,
	NULL_LOC: `Lost location is required`,
	NULL_DATE: `Event date is required`,

	EXCEED_MAX_CHAR: `Exceed 100 characters search max`,
	INVALID_STATUS: `Invalid status. Status can be only 'OPEN' / 'CLOSE'`,
	INVALID_TYPE: `Invalide type. Type can be only 'LOST' / 'FOUND'`,
	INVALID_PAGE: `Page is number only`,
	NEGATIVE_PAGE: `Page can't be negative`,
	INVALID_PAGESIZE: `Pagesize is number only`,
	PAGE_SIZE_NEGATIVE: `Pagesize can't be negative`,
	EXCEED_MAX_PAGESIZE: `Exceed 100 pages size max`,
	INVALID_DATE: `Invalid date format (YYYY-MM-DD)`
} as const;