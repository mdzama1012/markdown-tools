import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['COMPLETED', 'PENDING', 'FAILED']);

export const jobsTable = pgTable('jobs', {
	id: uuid('id').defaultRandom().primaryKey(),
	jobId: uuid('job_id').notNull().unique(),
	status: statusEnum().default('PENDING'),
	markdownFilekey: text('markdown_filekey').notNull(),
	pdfFilekey: text('pdf_filekey'),
});
