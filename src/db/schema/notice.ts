import { uuid, pgTable, text, pgEnum, date } from "drizzle-orm/pg-core";
import { users } from "../schema/users.js"
import { timestamp } from "drizzle-orm/cockroach-core";

export const typeEnum = pgEnum("type", ["LOST", "FOUND"]);
export const statusEnum = pgEnum("status", ["OPEN", "CLOSE"])

export const notice = pgTable("notice", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
	type: typeEnum("type").notNull(),
	description: text("description").notNull(),
	location: text("location").notNull(),
	evenDate: date("evenDate").notNull(),
	status: statusEnum("status").notNull().default("OPEN"),
	image: text("imageUrl"),
	owner: text("owner").notNull(),
	createAt: timestamp("createAt").notNull().defaultNow(),
	updateAt: timestamp("updateAt").notNull().defaultNow(),
});
