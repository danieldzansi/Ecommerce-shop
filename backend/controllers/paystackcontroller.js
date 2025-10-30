// controllers/paystackController.js
import { paystack } from "../config/paystack.js";
import db, { store } from "../db/index.js";
import { eq } from "drizzle-orm";

// ✅ Initialize payment and create order
export const initializePayment = async (req, res) => {
  try {
    const { items, email, address, totalAmount } = req.body;
    if (!email || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Prepare values and create order in Postgres (status: pending)
    const userId = req.user?._id ?? null;
    const itemsValue = Array.isArray(items) ? items : [];
    const totalAmountValue = Number(totalAmount) || 0;

    let order;
    try {
      console.log('Inserting order with', { userId, items: itemsValue, email, address, totalAmountValue });
      const inserted = await db
        .insert(store)
        .values({
          user_id: userId,
          items: itemsValue,
          email,
          address,
          total_amount: totalAmountValue,
          status: "pending",
        })
        .returning();
      order = inserted[0];
    } catch (dbErr) {
      console.error('DB insert failed', dbErr);
      return res.status(500).json({ success: false, message: 'DB insert failed', error: dbErr.message });
    }

    // Initialize Paystack transaction
    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: Math.round(totalAmount * 100), // convert to kobo/pesewas
      metadata: { orderId: order.id },
      callback_url: `${process.env.BASE_URL}/api/paystack/verify`,
    });

    // Save reference to order
    try {
      await db
        .update(store)
        .set({ reference: response.data.data.reference })
        .where(eq(store.id, order.id));
    } catch (upErr) {
      console.error('DB update reference failed', upErr);
      return res.status(500).json({ success: false, message: 'DB update failed', error: upErr.message });
    }

    return res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      orderId: order.id,
    });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Payment init failed" });
  }
};

// ✅ Verify payment
export const verifyPayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);

    const paymentData = response.data.data;
    const [order] = await db.select().from(store).where(eq(store.reference, reference)).limit(1);

    if (paymentData.status === "success" && order) {
      await db
        .update(store)
        .set({ status: "paid", paid_at: new Date() })
        .where(eq(store.reference, reference));
    }

    // If the client expects JSON (API call), return JSON. Otherwise redirect the user back to frontend.
    const accept = req.headers.accept || '';
    if (accept.includes('application/json')) {
      return res.json({ success: true, data: paymentData });
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontend.replace(/\/$/, '')}/payment-result?reference=${encodeURIComponent(
      reference
    )}&status=${encodeURIComponent(paymentData.status)}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// ✅ Webhook (optional but recommended)
export const paystackWebhook = async (req, res) => {
  const crypto = await import("crypto");
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const signature = req.headers["x-paystack-signature"];
  if (hash !== signature) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;
  if (event.event === "charge.success") {
    const ref = event.data.reference;
    const [order] = await db.select().from(store).where(eq(store.reference, ref)).limit(1);
    if (order) {
      await db
        .update(store)
        .set({ status: "paid", paid_at: new Date() })
        .where(eq(store.reference, ref));
    }
  }

  res.json({ received: true });
};
