CREATE TABLE IF NOT EXISTS "department" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "department_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"marca" text NOT NULL,
	"cor" text NOT NULL,
	"referencia" text NOT NULL,
	"descricao" text NOT NULL,
	"preco" integer,
	"complemento" text,
	"notaFiscal" text,
	"tamanho" text,
	"numero_identificacao" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "produtos_referencia_unique" UNIQUE("referencia")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text,
	"role" text DEFAULT 'user',
	"department" text,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
