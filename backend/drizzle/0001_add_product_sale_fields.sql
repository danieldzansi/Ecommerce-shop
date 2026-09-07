ALTER TABLE "products" ADD COLUMN "compareAtPrice" real;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "onSale" boolean DEFAULT false;
