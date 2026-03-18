CREATE TYPE "public"."status" AS ENUM('COMPLETED', 'PENDING', 'FAILED');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"markdown_file_key" text NOT NULL,
	"pdf_filekey" text,
	CONSTRAINT "jobs_job_id_unique" UNIQUE("job_id")
);
