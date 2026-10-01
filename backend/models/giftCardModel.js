import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { store } from "../db/index.js";

export const giftCardBatches = pgTable("gift_card_batches", {
  id: serial("id").primaryKey(),
  denomination: numeric("denomination", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("inactive"),
  expiresAt: timestamp("expires_at"),
  note: text("note"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  activatedAt: timestamp("activated_at"),
}, (table) => [
  check("gift_card_batches_denomination_check", sql`${table.denomination} IN (2000, 3000, 5000, 10000)`),
  check("gift_card_batches_status_check", sql`${table.status} IN ('inactive', 'active', 'disabled')`),
]);

export const giftCards = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").notNull().references(() => giftCardBatches.id),
  reference: text("reference").notNull(),
  codeHash: text("code_hash").notNull(),
  maskedCode: text("masked_code").notNull(),
  initialBalance: numeric("initial_balance", { precision: 12, scale: 2 }).notNull(),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("inactive"),
  expiresAt: timestamp("expires_at"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  activatedAt: timestamp("activated_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("gift_cards_reference_unique").on(table.reference),
  uniqueIndex("gift_cards_code_hash_unique").on(table.codeHash),
  check("gift_cards_balance_check", sql`${table.currentBalance} >= 0 AND ${table.currentBalance} <= ${table.initialBalance}`),
  check("gift_cards_status_check", sql`${table.status} IN ('inactive', 'active', 'disabled', 'redeemed')`),
]);

export const giftCardReservations = pgTable("gift_card_reservations", {
  id: serial("id").primaryKey(),
  giftCardId: integer("gift_card_id").notNull().references(() => giftCards.id),
  orderId: integer("order_id").notNull().references(() => store.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("reserved"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
}, (table) => [
  uniqueIndex("gift_card_one_open_reservation_per_order").on(table.orderId).where(sql`${table.status} = 'reserved'`),
  index("gift_card_reservations_lookup").on(table.giftCardId, table.status, table.expiresAt),
  check("gift_card_reservation_amount_check", sql`${table.amount} > 0`),
  check("gift_card_reservation_status_check", sql`${table.status} IN ('reserved', 'redeemed', 'released')`),
]);

export const giftCardTransactions = pgTable("gift_card_transactions", {
  id: serial("id").primaryKey(),
  giftCardId: integer("gift_card_id").notNull().references(() => giftCards.id),
  orderId: integer("order_id").references(() => store.id),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: numeric("balance_after", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  check("gift_card_transaction_type_check", sql`${table.type} IN ('reserve', 'redeem', 'release', 'refund', 'adjustment')`),
]);
