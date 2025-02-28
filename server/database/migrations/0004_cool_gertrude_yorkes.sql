CREATE TABLE IF NOT EXISTS "status" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "patrimonies" ADD COLUMN "status" text NOT NULL;