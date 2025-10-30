ALTER TABLE "images" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN IF EXISTS "data";