CREATE TABLE IF NOT EXISTS "images" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"patrimonies_id" text,
	"historical_id" text,
	"user_id" text,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "images_product_id_unique" UNIQUE("product_id"),
	CONSTRAINT "images_patrimonies_id_unique" UNIQUE("patrimonies_id")
);
