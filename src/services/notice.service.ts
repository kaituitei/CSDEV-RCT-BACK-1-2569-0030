import { postgres } from '../db/index.js'
import { type InferInsertModel } from 'drizzle-orm'
import { notice } from '../db/schema/notice.js'
import { sql, eq, and, count, desc } from 'drizzle-orm';

export type noticeTable = InferInsertModel<typeof notice>;

export async function createNotice(data: noticeTable) {
	const [newNotice] = await postgres
		.insert(notice)
		.values(data)
		.returning();

	return (newNotice);
};

export async function uploadImage(file?: File): Promise<string | undefined> {
	if (!file)
		return (undefined);

	const maxSize = 1024 * 1024 * 5; // 5 MB
	if (file.size > maxSize)
		throw new Error("File size exceed 5 MB");

	const allowType = ['image/jpeg', 'image/png', 'image/webp'];
	if (!allowType.includes(file.type))
		throw new Error("File type invalid. Only jpeg, png, and webp are allowed");

	// upload file to S3 bucket

	const imageUrl = undefined;
	return (imageUrl);
};

export async function getNoticeById(id: string) {
	const result = await postgres.select().from(notice).where(eq(notice.id, id));
	return (result[0]);
};

export async function getNoticeByFilter(
	whereClause: ReturnType<typeof and> | undefined,
	pageSize: number,
	offset: number,
	search?: string
	) {
	const searchCondition = search
		? sql`to_tsvector('english', ${notice.title} || ' ' || ${notice.description} || '' || ${notice.location}) @@ plainto_tsquery('english', ${search})`
		: undefined

	const finalWhere = searchCondition
		? whereClause
			? sql`${whereClause} AND ${searchCondition}`
			: searchCondition
		: whereClause

	const [data, totalResult] = await Promise.all([
		postgres
		.select()
		.from(notice)
		.where(finalWhere)
		.orderBy(desc(notice.createAt))
		.limit(pageSize)
		.offset(offset),
		postgres.select({ total: count() }).from(notice).where(finalWhere),
	])

	const total = totalResult[0]?.total ?? 0

	return { data, total }
}