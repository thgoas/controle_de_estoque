ALTER TABLE "historic" ADD COLUMN "type_historic" text NOT NULL;--> statement-breakpoint
ALTER TABLE "historic" DROP COLUMN IF EXISTS "type";