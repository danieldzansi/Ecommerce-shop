import crypto from "crypto";
import { pool } from "../db/index.js";

export const GIFT_CARD_DENOMINATIONS = [2000, 3000, 5000, 10000];
const RESERVATION_MINUTES = 30;
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const normalizeGiftCardCode = (value = "") =>
  String(value).toUpperCase().replace(/[^A-Z0-9]/g, "");

export const formatGiftCardCode = (normalized) => {
  const body = normalized.replace(/^ECLAT/, "");
  return `ECLAT-${body.match(/.{1,4}/g)?.join("-") || body}`;
};

export const generateGiftCardCode = () => {
  let body = "";
  const bytes = crypto.randomBytes(16);
  for (let i = 0; i < 16; i += 1) body += alphabet[bytes[i] % alphabet.length];
  return formatGiftCardCode(`ECLAT${body}`);
};

export const hashGiftCardCode = (code) => {
  const secret = process.env.GIFT_CARD_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error("GIFT_CARD_SECRET or JWT_SECRET must be configured");
  return crypto.createHmac("sha256", secret).update(normalizeGiftCardCode(code)).digest("hex");
};

export const maskGiftCardCode = (code) => `ECLAT-••••-••••-••••-${normalizeGiftCardCode(code).slice(-4)}`;

export const getGiftCardAvailability = async (client, codeHash, { lock = false } = {}) => {
  const lockClause = lock ? " FOR UPDATE" : "";
  const result = await client.query(
    `SELECT gc.*,
       GREATEST(0, gc.current_balance - COALESCE((
         SELECT SUM(gcr.amount) FROM gift_card_reservations gcr
         WHERE gcr.gift_card_id = gc.id AND gcr.status = 'reserved' AND gcr.expires_at > NOW()
       ), 0)) AS available_balance
     FROM gift_cards gc WHERE gc.code_hash = $1${lockClause}`,
    [codeHash]
  );
  return result.rows[0] || null;
};

export const validateGiftCardRecord = (card) => {
  if (!card) return "Gift card not found";
  if (card.status !== "active") return card.status === "inactive" ? "Gift card has not been activated" : "Gift card is not active";
  if (card.expires_at && new Date(card.expires_at) <= new Date()) return "Gift card has expired";
  if (Number(card.available_balance) <= 0) return "Gift card has no remaining balance";
  return "";
};

export const reserveGiftCard = async (client, { code, orderId, amount }) => {
  const card = await getGiftCardAvailability(client, hashGiftCardCode(code), { lock: true });
  const error = validateGiftCardRecord(card);
  if (error) throw new Error(error);
  const reservedAmount = Math.min(Number(amount), Number(card.available_balance));
  const result = await client.query(
    `INSERT INTO gift_card_reservations (gift_card_id, order_id, amount, status, expires_at)
     VALUES ($1, $2, $3, 'reserved', NOW() + ($4 * INTERVAL '1 minute')) RETURNING *`,
    [card.id, orderId, reservedAmount.toFixed(2), RESERVATION_MINUTES]
  );
  await client.query(
    `INSERT INTO gift_card_transactions (gift_card_id, order_id, type, amount, balance_after, note)
     VALUES ($1, $2, 'reserve', $3, $4, 'Checkout reservation')`,
    [card.id, orderId, reservedAmount.toFixed(2), Number(card.current_balance).toFixed(2)]
  );
  return { card, reservation: result.rows[0], amount: reservedAmount };
};

export const finalizeGiftCardReservation = async (client, orderId) => {
  const result = await client.query(
    `SELECT gcr.*, gc.current_balance FROM gift_card_reservations gcr
     JOIN gift_cards gc ON gc.id = gcr.gift_card_id
     WHERE gcr.order_id = $1 AND gcr.status = 'reserved' FOR UPDATE OF gcr, gc`, [orderId]
  );
  const reservation = result.rows[0];
  if (!reservation) return null;
  const balanceAfter = Number(reservation.current_balance) - Number(reservation.amount);
  if (balanceAfter < 0) throw new Error("Gift card balance is insufficient");
  await client.query(
    `UPDATE gift_cards SET current_balance = $1,
       status = CASE WHEN $1::numeric = 0 THEN 'redeemed' ELSE status END, updated_at = NOW() WHERE id = $2`,
    [balanceAfter.toFixed(2), reservation.gift_card_id]
  );
  await client.query("UPDATE gift_card_reservations SET status = 'redeemed', redeemed_at = NOW() WHERE id = $1", [reservation.id]);
  await client.query(
    `INSERT INTO gift_card_transactions (gift_card_id, order_id, type, amount, balance_after, note)
     VALUES ($1, $2, 'redeem', $3, $4, 'Applied to completed order')`,
    [reservation.gift_card_id, orderId, (-Number(reservation.amount)).toFixed(2), balanceAfter.toFixed(2)]
  );
  return reservation;
};

export const withTransaction = async (handler) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
