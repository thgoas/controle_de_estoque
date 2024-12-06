CREATE TABLE IF NOT EXISTS "movimentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipoMovimento" text NOT NULL,
	"produtoId" integer NOT NULL,
	"tamanho" text NOT NULL,
	"descricao" text NOT NULL,
	"notaFiscal" text,
	"quantidade" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "produtos" DROP COLUMN IF EXISTS "notaFiscal";