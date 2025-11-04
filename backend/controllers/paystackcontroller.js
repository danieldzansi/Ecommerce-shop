import { paystack } from "../config/paystack.js";
import db, { store } from "../db/index.js";
import { eq } from "drizzle-orm";


export const initializePayment = async (req, res) => {
  try {
    const { items, email, address, totalAmount } = req.body;
    if (!email || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

   
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

   
    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: Math.round(totalAmount * 100), 
      metadata: { orderId: order.id },
      callback_url: `${process.env.BASE_URL}/api/paystack/verify`,
    });

   
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

   
    const accept = req.headers.accept || '';
    if (accept.includes('application/json')) {
      return res.json({ success: true, data: paymentData });
    }

    const rawFrontend = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL ;
    const frontend = rawFrontend.split(',').map(s => s.trim()).filter(Boolean)[0];
    const baseFrontend = (frontend || 'https://ecommerce-shop-lovat-pi.vercel.app').replace(/\/$/, '');
    const redirectUrl = `${baseFrontend}/payment-result?reference=${encodeURIComponent(reference)}&status=${encodeURIComponent(
      paymentData.status
    )}`;
  
    console.log('Paystack verify redirect ->', redirectUrl);
    const safeHtml = `
<script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
<p>Redirecting to the site… If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
`;

    return res.status(200).type('html').send(safeHtml);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const paystackWebhook = async (req, res) => {
  console.log("Webhook Payload:", JSON.stringify(req.body, null, 2));
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
    console.log(`Payment Successful. Reference: ${ref}`);
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
