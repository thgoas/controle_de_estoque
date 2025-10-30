ALTER TABLE "images" ADD COLUMN "data" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN IF EXISTS "url";