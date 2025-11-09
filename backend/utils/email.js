// utils/email.js
import { Resend } from "resend"; // Correct package and import

let resend = null;
let _resendInitialized = false;

// Sender and admin emails
const fromAddress = process.env.SEND_FROM || "no-reply@yourshop.com";
const adminEmail = process.env.ADMIN_EMAIL || "admin@yourshop.com";

/**
 * Lazy-load Resend
 */
async function ensureResend() {
  if (_resendInitialized) return;
  _resendInitialized = true;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY not set. Emails will not be sent.");
    return;
  }

  try {
    resend = new Resend(key);
    console.log("Resend initialized ✅");
  } catch (err) {
    console.warn("Failed to initialize Resend:", err?.message || err);
    resend = null;
  }
}

/**
 * Format order items into HTML table rows
 */
function formatItemsHtml(items) {
  if (!Array.isArray(items)) return "";
  return items
    .map(
      (it) => `
    <tr>
      <td style="padding:8px;border:1px solid #eaeaea">${it.name}</td>
      <td style="padding:8px;border:1px solid #eaeaea;text-align:center">${it.quantity}</td>
      <td style="padding:8px;border:1px solid #eaeaea;text-align:right">${Number(it.price).toFixed(2)}</td>
    </tr>`
    )
    .join("\n");
}

/**
 * Send order emails to user and admin
 */
export async function sendOrderEmails(order) {
  await ensureResend();
  if (!resend) {
    console.warn("Resend not configured. Skipping order emails.");
    return;
  }

  const itemsHtml = formatItemsHtml(order.items || []);
  const subtotal = (order.items || []).reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
  ).toFixed(2);
  const total = Number(order.total_amount || 0).toFixed(2);

  // User email HTML
  const userHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
      <h2>Thank you for your order</h2>
      <p>Order #${order.id} — ${order.status}</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border:1px solid #eaeaea">Item</th>
            <th style="padding:8px;border:1px solid #eaeaea">Qty</th>
            <th style="text-align:right;padding:8px;border:1px solid #eaeaea">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p>Subtotal: ${subtotal}</p>
      <p>Total: ${total}</p>
      <p>If you have any questions, reply to this email.</p>
    </div>
  `;

  // Admin email HTML
  const adminHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
      <h2>New order received</h2>
      <p>Order #${order.id} — ${order.status}</p>
      <p>Customer: ${order.email}</p>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border:1px solid #eaeaea">Item</th>
            <th style="padding:8px;border:1px solid #eaeaea">Qty</th>
            <th style="text-align:right;padding:8px;border:1px solid #eaeaea">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p>Subtotal: ${subtotal}</p>
      <p>Total: ${total}</p>
      <p>Order reference: ${order.reference || "—"}</p>
    </div>
  `;

  // Log emails for local testing
  console.log("=== Email Preview ===");
  console.log("User email HTML:", userHtml);
  console.log("Admin email HTML:", adminHtml);
  console.log("=====================");

  try {
    // Send to user
    if (order.email) {
      await resend.emails.send({
        from: fromAddress,
        to: order.email,
        subject: `Order confirmation — #${order.id}`,
        html: userHtml,
      });
    }

    // Send to admin
    if (adminEmail) {
      await resend.emails.send({
        from: fromAddress,
        to: adminEmail,
        subject: `New order received — #${order.id}`,
        html: adminHtml,
      });
    }

    console.log("Order emails sent successfully ✅");
  } catch (err) {
    console.error("Error sending order emails:", err?.message || err);
  }
}

export default { sendOrderEmails };