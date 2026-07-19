import { uuid, pgTable, text, pgEnum, date } from "drizzle-orm/pg-core";
import { users } from "../schema/users.js"

export const typeEnum = pgEnum("type", ["LOST", "FOUND"]);
export const statusEnum = pgEnum("status", ["OPEN", "CLOSE"])

export const notice = pgTable("notice", {
	user_id: uuid("user_id").primaryKey().references(() => users.id),
	type: typeEnum("type").notNull(),
	description: text("description").notNull(),
	location: text("location").notNull(),
	evenDate: date("evenDate").notNull(),
	status: statusEnum("status").notNull(),
	image: text("imageUrl"),
	owner: text("owner").notNull(),
	createAt: date("createAt").notNull().defaultNow(),
	updateAt: date("updateAt").notNull().defaultNow(),
});
