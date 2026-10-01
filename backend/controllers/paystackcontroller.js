import crypto from "crypto";
import { paystack } from "../config/paystack.js";
import { pool } from "../db/index.js";
import { sendOrderEmails } from "../utils/email.js";
import { finalizeGiftCardReservation, reserveGiftCard, withTransaction } from "../services/giftCardService.js";

const requiredDeliveryFields = ["firstName", "lastName", "email", "phone", "street", "city", "region"];
const PAYSTACK_GHANA_FEE_RATE = 0.0195;
const money = (value) => Number(Number(value || 0).toFixed(2));
const getPaystackGrossAmount = (amount) => amount ? money(amount / (1 - PAYSTACK_GHANA_FEE_RATE)) : 0;

const normalizeDeliveryDetails = (deliveryDetails = {}, fallbackAddress = "") => {
  const normalized = requiredDeliveryFields.reduce((acc, field) => {
    acc[field] = String(deliveryDetails[field] || "").trim();
    return acc;
  }, {});
  normalized.country = "Ghana";
  normalized.fulfillmentMethod = deliveryDetails.fulfillmentMethod === "pickup" ? "pickup" : "delivery";
  const required = normalized.fulfillmentMethod === "pickup"
    ? ["firstName", "lastName", "email", "phone"] : requiredDeliveryFields;
  const missingFields = required.filter((field) => !normalized[field]);
  if (missingFields.length > 0) return { error: `Missing delivery fields: ${missingFields.join(", ")}` };
  const address = fallbackAddress || [
    `${normalized.firstName} ${normalized.lastName}`, normalized.phone,
    normalized.fulfillmentMethod === "pickup" ? "Store pickup" : normalized.street,
    normalized.city, normalized.region, "Ghana",
  ].filter(Boolean).join(", ");
  return { error: "", address, deliveryDetails: normalized };
};

const buildServerPricedItems = async (client, requestedItems) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) throw new Error("Your cart is empty");
  const enhancedItems = [];
  for (const item of requestedItems) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw new Error("Invalid item quantity");
    const result = await client.query("SELECT id, name, price, image, sizes, variants FROM products WHERE id = $1 LIMIT 1", [item.id]);
    const product = result.rows[0];
    if (!product) throw new Error("A product in your cart is no longer available");
    enhancedItems.push({
      id: product.id, name: product.name, price: money(product.price), quantity,
      size: String(item.size || ""), colorName: String(item.colorName || ""),
      colorValue: String(item.colorValue || ""),
      image: item.image || (Array.isArray(product.image) ? product.image[0] : product.image || null),
    });
  }
  return enhancedItems;
};

const completeOrder = async (orderId, reference = null) => withTransaction(async (client) => {
  const result = await client.query("SELECT * FROM store WHERE id = $1 FOR UPDATE", [orderId]);
  const order = result.rows[0];
  if (!order) return null;
  if (order.status === "paid") return order;
  await finalizeGiftCardReservation(client, order.id);
  const updated = await client.query(
    "UPDATE store SET status = 'paid', paid_at = NOW(), updated_at = NOW() WHERE id = $1 AND ($2::text IS NULL OR reference = $2) RETURNING *",
    [order.id, reference]
  );
  return updated.rows[0] || null;
});

const sendEmailsSafely = async (order) => {
  if (!order) return;
  try { await sendOrderEmails(order); }
  catch (error) { console.warn("Failed to send order emails:", error?.message || error); }
};

export const initializePayment = async (req, res) => {
  try {
    const { items, email, address, deliveryDetails, giftCardCode } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Missing email" });
    const normalizedDelivery = normalizeDeliveryDetails(deliveryDetails, String(address || "").trim());
    if (normalizedDelivery.error) return res.status(400).json({ success: false, message: normalizedDelivery.error });

    const checkout = await withTransaction(async (client) => {
      const serverItems = await buildServerPricedItems(client, items);
      const subtotal = money(serverItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
      const fulfillmentFee = normalizedDelivery.deliveryDetails.fulfillmentMethod === "pickup" ? 0 : 60;
      const redeemableTotal = money(subtotal + fulfillmentFee);
      const provisional = await client.query(
        `INSERT INTO store (user_id, items, email, address, total_amount, status, subtotal, fulfillment_fee, processing_fee, gift_card_amount, paystack_amount)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, 0, 0, $5) RETURNING *`,
        [req.user?._id ?? null, JSON.stringify(serverItems), String(email).trim(), normalizedDelivery.address, redeemableTotal.toFixed(2), subtotal.toFixed(2), fulfillmentFee.toFixed(2)]
      );
      const order = provisional.rows[0];
      let giftCardAmount = 0;
      let giftCardMasked = null;
      if (String(giftCardCode || "").trim()) {
        const reservation = await reserveGiftCard(client, { code: giftCardCode, orderId: order.id, amount: redeemableTotal });
        giftCardAmount = money(reservation.amount);
        giftCardMasked = reservation.card.masked_code;
      }
      const cashBeforeFee = money(redeemableTotal - giftCardAmount);
      const paystackAmount = getPaystackGrossAmount(cashBeforeFee);
      const processingFee = money(paystackAmount - cashBeforeFee);
      const totalAmount = money(redeemableTotal + processingFee);
      const updated = await client.query(
        `UPDATE store SET total_amount = $1, processing_fee = $2, gift_card_amount = $3,
          paystack_amount = $4, gift_card_masked = $5, updated_at = NOW() WHERE id = $6 RETURNING *`,
        [totalAmount.toFixed(2), processingFee.toFixed(2), giftCardAmount.toFixed(2), paystackAmount.toFixed(2), giftCardMasked, order.id]
      );
      if (paystackAmount === 0) {
        await finalizeGiftCardReservation(client, order.id);
        const paid = await client.query("UPDATE store SET status = 'paid', paid_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *", [order.id]);
        return { order: paid.rows[0], serverItems, paystackAmount, fullyPaid: true };
      }
      return { order: updated.rows[0], serverItems, paystackAmount, fullyPaid: false };
    });

    if (checkout.fullyPaid) {
      await sendEmailsSafely(checkout.order);
      return res.json({ success: true, fullyPaid: true, orderId: checkout.order.id, status: "paid" });
    }

    const rawFrontend = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || "https://ecommerce-shop-lovat-pi.vercel.app";
    const frontendURL = rawFrontend.split(",").map((s) => s.trim()).filter(Boolean)[0].replace(/\/$/, "");
    const response = await paystack.post("/transaction/initialize", {
      email: checkout.order.email, amount: Math.round(checkout.paystackAmount * 100),
      metadata: { orderId: checkout.order.id, deliveryCountry: "Ghana", deliveryRegion: normalizedDelivery.deliveryDetails.region, fulfillmentMethod: normalizedDelivery.deliveryDetails.fulfillmentMethod, giftCardAmount: Number(checkout.order.gift_card_amount), processingFee: Number(checkout.order.processing_fee) },
      callback_url: `${frontendURL}/payment-result`,
    });
    await pool.query("UPDATE store SET reference = $1, updated_at = NOW() WHERE id = $2", [response.data.data.reference, checkout.order.id]);
    return res.json({ success: true, authorization_url: response.data.data.authorization_url, reference: response.data.data.reference, orderId: checkout.order.id });
  } catch (error) {
    console.error(error?.response?.data || error);
    const clientError = /cart|product|quantity|Gift card|activated|expired|balance|active/.test(error.message);
    return res.status(clientError ? 400 : 500).json({ success: false, message: clientError ? error.message : "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const reference = req.query.reference || req.query.trxref;
  if (!reference) return res.status(400).json({ success: false, message: "Missing transaction reference" });
  try {
    const response = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);
    const paymentData = response.data.data;
    const orderResult = await pool.query("SELECT * FROM store WHERE reference = $1 LIMIT 1", [reference]);
    let order = orderResult.rows[0];
    if (paymentData.status === "success" && order) {
      const paidAmount = money(Number(paymentData.amount) / 100);
      if (paidAmount !== money(order.paystack_amount)) throw new Error("Payment amount does not match order total");
      const wasPending = order.status !== "paid";
      order = await completeOrder(order.id, reference);
      if (wasPending) await sendEmailsSafely(order);
    }
    const result = { ...paymentData, orderId: order?.id || null };
    if ((req.headers.accept || "").includes("application/json")) return res.json({ success: true, data: result });
    const rawFrontend = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || "https://ecommerce-shop-lovat-pi.vercel.app";
    const baseFrontend = rawFrontend.split(",").map((s) => s.trim()).filter(Boolean)[0].replace(/\/$/, "");
    const redirectUrl = `${baseFrontend}/payment-result?reference=${encodeURIComponent(reference)}&orderId=${order?.id || ""}&status=${encodeURIComponent(paymentData.status)}`;
    return res.status(200).send(`<script>window.location.replace(${JSON.stringify(redirectUrl)});</script><p>If you are not redirected, <a href="${redirectUrl}">click here</a>.</p>`);
  } catch (error) {
    console.error(error?.response?.data || error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const paystackWebhook = async (req, res) => {
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) return res.status(400).send("Invalid signature");
  if (req.body.event === "charge.success") {
    try {
      const reference = req.body.data.reference;
      const result = await pool.query("SELECT * FROM store WHERE reference = $1 LIMIT 1", [reference]);
      const order = result.rows[0];
      if (order && order.status !== "paid") {
        const paidAmount = money(Number(req.body.data.amount) / 100);
        if (paidAmount !== money(order.paystack_amount)) throw new Error("Webhook amount does not match order total");
        await sendEmailsSafely(await completeOrder(order.id, reference));
      }
    } catch (error) { console.error("Webhook error:", error?.message || error); }
  }
  return res.json({ received: true });
};
