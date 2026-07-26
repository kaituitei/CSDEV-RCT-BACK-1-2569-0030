import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	notice: {
		user: r.one.users({
			from: r.notice.userId,
			to: r.users.id
		}),
	},
	users: {
		notices: r.many.notice(),
	},
}))