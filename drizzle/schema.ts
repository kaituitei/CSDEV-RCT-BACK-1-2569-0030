import { pgEnum, pgTable, uuid, varchar, text, date, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const status = pgEnum("status", ["OPEN", "CLOSE"])
export const type = pgEnum("type", ["LOST", "FOUND"])


export const notice = pgTable("notice", {
	userId: uuid("user_id").primaryKey().references(() => users.id),
	type: type().notNull(),
	description: text().notNull(),
	location: text().notNull(),
	evenDate: date().notNull(),
	status: status().notNull(),
	imageUrl: text(),
	owner: text().notNull(),
	createAt: date().default(sql`now()`).notNull(),
	updateAt: date().default(sql`now()`).notNull(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	userName: varchar({ length: 255 }).notNull(),
	passwordHash: text().notNull(),
}, (table) => [
	unique("users_userName_key").on(table.userName),]);
