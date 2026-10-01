CREATE TABLE "gift_card_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"denomination" numeric(12, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"status" text DEFAULT 'inactive' NOT NULL,
	"expires_at" timestamp,
	"note" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"activated_at" timestamp,
	CONSTRAINT "gift_card_batches_denomination_check" CHECK ("gift_card_batches"."denomination" IN (2000, 3000, 5000, 10000)),
	CONSTRAINT "gift_card_batches_status_check" CHECK ("gift_card_batches"."status" IN ('inactive', 'active', 'disabled'))
);
--> statement-breakpoint
CREATE TABLE "gift_card_reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"gift_card_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'reserved' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"redeemed_at" timestamp,
	CONSTRAINT "gift_card_reservation_amount_check" CHECK ("gift_card_reservations"."amount" > 0),
	CONSTRAINT "gift_card_reservation_status_check" CHECK ("gift_card_reservations"."status" IN ('reserved', 'redeemed', 'released'))
);
--> statement-breakpoint
CREATE TABLE "gift_card_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"gift_card_id" integer NOT NULL,
	"order_id" integer,
	"type" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"balance_after" numeric(12, 2) NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gift_card_transaction_type_check" CHECK ("gift_card_transactions"."type" IN ('reserve', 'redeem', 'release', 'refund', 'adjustment'))
);
--> statement-breakpoint
CREATE TABLE "gift_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"reference" text NOT NULL,
	"code_hash" text NOT NULL,
	"masked_code" text NOT NULL,
	"initial_balance" numeric(12, 2) NOT NULL,
	"current_balance" numeric(12, 2) NOT NULL,
	"status" text DEFAULT 'inactive' NOT NULL,
	"expires_at" timestamp,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"activated_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gift_cards_balance_check" CHECK ("gift_cards"."current_balance" >= 0 AND "gift_cards"."current_balance" <= "gift_cards"."initial_balance"),
	CONSTRAINT "gift_cards_status_check" CHECK ("gift_cards"."status" IN ('inactive', 'active', 'disabled', 'redeemed'))
);
--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "subtotal" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "fulfillment_fee" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "processing_fee" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "gift_card_amount" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "paystack_amount" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "gift_card_masked" text;--> statement-breakpoint
ALTER TABLE "gift_card_reservations" ADD CONSTRAINT "gift_card_reservations_gift_card_id_gift_cards_id_fk" FOREIGN KEY ("gift_card_id") REFERENCES "public"."gift_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_card_reservations" ADD CONSTRAINT "gift_card_reservations_order_id_store_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_gift_card_id_gift_cards_id_fk" FOREIGN KEY ("gift_card_id") REFERENCES "public"."gift_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_order_id_store_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_batch_id_gift_card_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."gift_card_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gift_card_one_open_reservation_per_order" ON "gift_card_reservations" USING btree ("order_id") WHERE "gift_card_reservations"."status" = 'reserved';--> statement-breakpoint
CREATE INDEX "gift_card_reservations_lookup" ON "gift_card_reservations" USING btree ("gift_card_id","status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "gift_cards_reference_unique" ON "gift_cards" USING btree ("reference");--> statement-breakpoint
CREATE UNIQUE INDEX "gift_cards_code_hash_unique" ON "gift_cards" USING btree ("code_hash");