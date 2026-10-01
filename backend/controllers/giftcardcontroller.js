import { pool } from "../db/index.js";
import {
  GIFT_CARD_DENOMINATIONS, generateGiftCardCode, getGiftCardAvailability,
  hashGiftCardCode, maskGiftCardCode, normalizeGiftCardCode,
  validateGiftCardRecord, withTransaction,
} from "../services/giftCardService.js";

const parseExpiry = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const validateGiftCard = async (req, res) => {
  try {
    const code = normalizeGiftCardCode(req.body?.code);
    if (!code) return res.status(400).json({ success: false, message: "Enter a gift card code" });
    const card = await getGiftCardAvailability(pool, hashGiftCardCode(code));
    const error = validateGiftCardRecord(card);
    if (error) return res.status(400).json({ success: false, message: error });
    return res.json({ success: true, data: { maskedCode: card.masked_code, availableBalance: Number(card.available_balance), expiresAt: card.expires_at } });
  } catch (error) {
    console.error("validateGiftCard error", error);
    return res.status(500).json({ success: false, message: "Unable to validate gift card" });
  }
};

export const generateBatch = async (req, res) => {
  try {
    const denomination = Number(req.body?.denomination);
    const quantity = Number(req.body?.quantity);
    const expiresAt = parseExpiry(req.body?.expiresAt);
    const note = String(req.body?.note || "").trim();
    if (!GIFT_CARD_DENOMINATIONS.includes(denomination)) return res.status(400).json({ success: false, message: "Invalid denomination" });
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) return res.status(400).json({ success: false, message: "Quantity must be between 1 and 500" });
    if (req.body?.expiresAt && !expiresAt) return res.status(400).json({ success: false, message: "Invalid expiry date" });

    const createdBy = req.adminEmail || "admin";
    const payload = await withTransaction(async (client) => {
      const batchResult = await client.query(
        `INSERT INTO gift_card_batches (denomination, quantity, status, expires_at, note, created_by)
         VALUES ($1, $2, 'inactive', $3, $4, $5) RETURNING *`,
        [denomination.toFixed(2), quantity, expiresAt, note || null, createdBy]
      );
      const batch = batchResult.rows[0];
      const cards = [];
      for (let index = 0; index < quantity; index += 1) {
        let code;
        let inserted;
        for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
          code = generateGiftCardCode();
          try {
            const reference = `GC-${String(batch.id).padStart(5, "0")}-${String(index + 1).padStart(4, "0")}`;
            const result = await client.query(
              `INSERT INTO gift_cards (batch_id, reference, code_hash, masked_code, initial_balance, current_balance, status, expires_at, created_by)
               VALUES ($1, $2, $3, $4, $5, $5, 'inactive', $6, $7) ON CONFLICT DO NOTHING RETURNING id, reference`,
              [batch.id, reference, hashGiftCardCode(code), maskGiftCardCode(code), denomination.toFixed(2), expiresAt, createdBy]
            );
            inserted = result.rows[0];
          } catch (error) {
            throw error;
          }
        }
        if (!inserted) throw new Error("Could not generate a unique gift card code");
        cards.push({ voucherReference: inserted.reference, giftCardCode: code, amount: denomination.toFixed(2), currency: "GHS", expiryDate: expiresAt ? expiresAt.toISOString().slice(0, 10) : "" });
      }
      return { batch, cards };
    });
    return res.status(201).json({ success: true, message: "Download these codes now; they cannot be retrieved again.", data: payload });
  } catch (error) {
    console.error("generateBatch error", error);
    return res.status(500).json({ success: false, message: "Failed to generate gift cards" });
  }
};

export const listBatches = async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT gcb.*, COUNT(gc.id)::int AS card_count,
        COUNT(gc.id) FILTER (WHERE gc.status = 'active')::int AS active_count,
        COUNT(gc.id) FILTER (WHERE gc.status = 'redeemed')::int AS redeemed_count,
        COALESCE(SUM(gc.current_balance), 0) AS remaining_value
       FROM gift_card_batches gcb LEFT JOIN gift_cards gc ON gc.batch_id = gcb.id
       GROUP BY gcb.id ORDER BY gcb.created_at DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("listBatches error", error);
    return res.status(500).json({ success: false, message: "Failed to load gift card batches" });
  }
};

export const activateBatch = async (req, res) => {
  try {
    const batchId = Number(req.params.id);
    if (!Number.isInteger(batchId)) return res.status(400).json({ success: false, message: "Invalid batch" });
    await withTransaction(async (client) => {
      const batch = await client.query("SELECT * FROM gift_card_batches WHERE id = $1 FOR UPDATE", [batchId]);
      if (!batch.rows[0]) throw new Error("Gift card batch not found");
      if (batch.rows[0].status !== "inactive") throw new Error("Only inactive batches can be activated");
      await client.query("UPDATE gift_card_batches SET status = 'active', activated_at = NOW() WHERE id = $1", [batchId]);
      await client.query("UPDATE gift_cards SET status = 'active', activated_at = NOW(), updated_at = NOW() WHERE batch_id = $1 AND status = 'inactive'", [batchId]);
    });
    return res.json({ success: true, message: "Gift card batch activated" });
  } catch (error) {
    return res.status(/not found|Only inactive/.test(error.message) ? 400 : 500).json({ success: false, message: error.message || "Failed to activate batch" });
  }
};

export default { validateGiftCard, generateBatch, listBatches, activateBatch };
