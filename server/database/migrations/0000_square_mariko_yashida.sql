CREATE TABLE IF NOT EXISTS "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"assetsClassificationId" text NOT NULL,
	"assetsTypeId" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assetsClassification" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assetsSubgroup" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assetssubgroup_assets" (
	"assetsSubgroupId" text,
	"assetsId" text,
	CONSTRAINT "assetssubgroup_assets_assetsSubgroupId_assetsId_pk" PRIMARY KEY("assetsSubgroupId","assetsId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assetsType" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "department" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "department_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "historic" (
	"id" text PRIMARY KEY NOT NULL,
	"patrimony_id" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"it_went_out_id" text,
	"entered_store_id" text,
	"it_went_out_sector_id" text,
	"entered_sector_id" text,
	"it_went_out_date" date,
	"entered_date" date,
	"user_identification_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movimentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipoMovimento" text NOT NULL,
	"produtoId" integer NOT NULL,
	"tamanho" text NOT NULL,
	"descricao" text NOT NULL,
	"notaFiscal" text,
	"quantidade" integer NOT NULL,
	"departamento" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patrimonies" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"serial_number" text,
	"assets_id" text NOT NULL,
	"assets_subgroup_id" text NOT NULL,
	"store_id" text NOT NULL,
	"sector_id" text NOT NULL,
	"invoice" text,
	"purchase_date" date,
	"price" numeric NOT NULL,
	"guarantee_date" date,
	"low_date" date,
	"note" text,
	"people" text,
	"provider_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patrimonies_connections" (
	"patrimonyIdOne" text,
	"patrimonyIdTwo" text,
	CONSTRAINT "patrimonies_connections_patrimonyIdOne_patrimonyIdTwo_pk" PRIMARY KEY("patrimonyIdOne","patrimonyIdTwo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"marca" text NOT NULL,
	"cor" text NOT NULL,
	"referencia" text NOT NULL,
	"descricao" text NOT NULL,
	"complemento" text,
	"grade" text NOT NULL,
	"modelo" text NOT NULL,
	"tipo" text NOT NULL,
	"departamento" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "produtos_referencia_unique" UNIQUE("referencia")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"cnpj" text NOT NULL,
	"address" text NOT NULL,
	"contact_name" text,
	"phone" text,
	"cep" text,
	"status" boolean DEFAULT true,
	"email" text,
	"obs" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sectors" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"cnpj" text NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text,
	"role" text DEFAULT 'user',
	"department" text,
	"patrimony" boolean DEFAULT false,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
