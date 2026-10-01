CREATE TABLE "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"items" jsonb,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reference" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email"),
	CONSTRAINT "admin_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"image" jsonb NOT NULL,
	"category" varchar(255) NOT NULL,
	"subCategory" varchar(255) NOT NULL,
	"sizes" jsonb NOT NULL,
	"bestseller" boolean DEFAULT false
);
