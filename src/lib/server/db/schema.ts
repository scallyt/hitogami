import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

export const userTable = sqliteTable("users", {
	id: text("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	tokens: integer("tokens").notNull().$default(() => 0),
	createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at').$onUpdate(() => sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at", {
		mode: "timestamp"
	}).notNull()
});

export const fileTable = sqliteTable("file", {
	id: text("id", { length: 36 })
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	filename: text("filename"),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;