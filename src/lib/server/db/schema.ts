import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'node:crypto';

export const userTable = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

export const filesTable = sqliteTable('files', {
	id: text("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
	filename: text('filename'),
});
