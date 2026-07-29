import { postgres } from '../db/index.js'
import { type InferInsertModel } from 'drizzle-orm'
import { notice } from '../db/schema/notice.js'
import { sql, eq, and, count, desc } from 'drizzle-orm';

export type newTable = InferInsertModel<typeof notice>;
export type updateTable = Partial<typeof notice.$inferInsert>

export async function itemExit(id: string) {
	const result = await postgres.select().from(notice).where(eq(notice.id, id));
	return (result[0]);
};

export async function createNotice(data: newTable) {
	const [newNotice] = await postgres
		.insert(notice)
		.values(data)
		.returning();

	return (newNotice);
};

export async function deleteNotice(id: string) {
	const result = await postgres.delete(notice).where(eq(notice.id, id));
	return (result);
};

export async function updateNotice(id: string, updateData: updateTable) {
	if (Object.keys(updateData).length === 0)
		throw new Error (`No fields to update`);

	const result = await postgres
		.update(notice)
		.set(updateData)
		.where(eq(notice.id, id))
		.returning()

	return (result[0]);
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
};

export async function getImageById(id: string) {
	const imageUrl =  await postgres.select().from(notice).where(eq(notice.id, id)).limit(1);
	return (imageUrl[0]?.image);
};

export async function getUserNotice(userId: string) {
	const noticeList = await postgres.select({ title: notice.title, id: notice.id }).from(notice).where(eq(notice.userId, userId))
	return (noticeList);
}