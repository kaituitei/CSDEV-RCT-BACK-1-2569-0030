import { defineRelations } from "drizzle-orm";
import { users } from "./schema/users.js"
import { notice } from "./schema/notice.js"

export const relations = defineRelations({ users, notice }, (r) => ({
	users: {
		notice: r.one.notice({
			from: r.users.id,
			to: r.notice.userId,
		})
	}
}));