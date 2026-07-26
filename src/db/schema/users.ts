import { sql } from "drizzle-orm";
import { uuid, pgTable, varchar , text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	userName: varchar({ length: 255 }).notNull().unique(),
	passwordHash: text("passwordHash").notNull(),
});
