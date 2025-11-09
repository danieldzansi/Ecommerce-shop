// utils/email.js
import { Resend } from "resend";

let resend = null;
let _resendInitialized = false;

// Sender and admin emails
const fromAddress = process.env.SEND_FROM || "no-reply@yourshop.com";
const adminEmail = process.env.ADMIN_USER || "admin@yourshop.com";

// Brand colors - customize these
const brandColor = "#4F46E5"; // Indigo
const successColor = "#10B981"; // Green
const backgroundColor = "#F9FAFB";

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
      <td style="padding:16px 12px;border-bottom:1px solid #E5E7EB">
        <div style="font-weight:600;color:#111827;margin-bottom:4px">${it.name}</div>
        <div style="font-size:13px;color:#6B7280">Qty: ${it.quantity}</div>
      </td>
      <td style="padding:16px 12px;border-bottom:1px solid #E5E7EB;text-align:right;font-weight:600;color:#111827">
        GH₵ ${Number(it.price).toFixed(2)}
      </td>
    </tr>`
    )
    .join("\n");
}

/**
 * Create professional email template wrapper
 */
function emailWrapper(content, isAdmin = false) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? "New Order Notification" : "Order Confirmation"}</title>
</head>
<body style="margin:0;padding:0;background-color:${backgroundColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background-color:${backgroundColor}">
    <tr>
      <td align="center" style="padding:40px 0">
        <table role="presentation" style="width:600px;max-width:100%;border-collapse:collapse;border:0;border-spacing:0;background-color:#ffffff;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);border-radius:8px;overflow:hidden">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send order emails to user and admin
 */
export async function sendOrderEmails(order) {
  console.log("📧 sendOrderEmails called with order:", order.id);
  
  await ensureResend();
  if (!resend) {
    console.warn("⚠️ Resend not configured. Skipping order emails.");
    return;
  }
  
  console.log("✅ Resend client initialized");

  const itemsHtml = formatItemsHtml(order.items || []);
  const subtotal = (order.items || []).reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );
  const shipping = 10; // Add your shipping cost logic
  const total = Number(order.total_amount || 0);

  // Format date
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // User email content
  const userContent = `
    <!-- Header -->
    <tr>
      <td style="padding:40px 40px 30px;background:linear-gradient(135deg, ${brandColor} 0%, #6366F1 100%)">
        <div style="text-align:center">
          <div style="background-color:rgba(255,255,255,0.2);width:80px;height:80px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Order Confirmed!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9)">Thank you for your purchase</p>
        </div>
      </td>
    </tr>

    <!-- Order Info -->
    <tr>
      <td style="padding:40px">
        <div style="background-color:#F3F4F6;border-radius:8px;padding:20px;margin-bottom:30px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0">
                <div style="font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Order Number</div>
                <div style="font-size:18px;color:#111827;font-weight:700;margin-top:4px">#${order.id}</div>
              </td>
              <td style="padding:8px 0;text-align:right">
                <div style="font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Order Date</div>
                <div style="font-size:16px;color:#111827;font-weight:600;margin-top:4px">${orderDate}</div>
              </td>
            </tr>
          </table>
        </div>

        <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#111827">Order Details</h2>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:30px">
          <thead>
            <tr style="border-bottom:2px solid #E5E7EB">
              <th style="padding:12px;text-align:left;font-size:13px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Item</th>
              <th style="padding:12px;text-align:right;font-size:13px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="border-top:2px solid #E5E7EB;padding-top:20px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
            <tr>
              <td style="padding:8px 0;font-size:15px;color:#6B7280">Subtotal</td>
              <td style="padding:8px 0;text-align:right;font-size:15px;color:#111827;font-weight:600">GH₵ ${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:15px;color:#6B7280">Shipping</td>
              <td style="padding:8px 0;text-align:right;font-size:15px;color:#111827;font-weight:600">GH₵ ${shipping.toFixed(2)}</td>
            </tr>
          </table>
          <div style="background-color:#F3F4F6;border-radius:8px;padding:16px;margin-top:12px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="font-size:18px;color:#111827;font-weight:700">Total</td>
                <td style="text-align:right;font-size:22px;color:${brandColor};font-weight:700">GH₵ ${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Shipping Address -->
        ${order.address ? `
        <div style="margin-top:30px;padding:20px;background-color:#F9FAFB;border-radius:8px;border-left:4px solid ${brandColor}">
          <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.5px">Shipping Address</h3>
          <p style="margin:0;font-size:15px;color:#4B5563;line-height:1.6">${order.address}</p>
        </div>
        ` : ''}

        <!-- Status Badge -->
        <div style="margin-top:30px;text-align:center">
          <span style="display:inline-block;padding:10px 24px;background-color:${successColor};color:#ffffff;border-radius:100px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
            ${order.status}
          </span>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:30px 40px;background-color:#F9FAFB;border-top:1px solid #E5E7EB">
        <p style="margin:0 0 16px;font-size:15px;color:#4B5563;line-height:1.6">
          We'll send you shipping confirmation when your order is on the way. If you have any questions, reply to this email or contact our support team.
        </p>
        <p style="margin:0;font-size:13px;color:#9CA3AF;text-align:center">
          © ${new Date().getFullYear()} Your Shop. All rights reserved.
        </p>
      </td>
    </tr>
  `;

  // Admin email content
  const adminContent = `
    <!-- Header -->
    <tr>
      <td style="padding:40px 40px 30px;background-color:#111827">
        <div style="text-align:center">
          <div style="background-color:#374151;width:80px;height:80px;margin:0 auto 20px;border-radius:50%;display:flex;align-items:center;justify-content:center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#10B981" stroke-width="2"/>
              <path d="M9 11L11 13L15 9" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">New Order Received</h1>
          <p style="margin:12px 0 0;font-size:16px;color:#9CA3AF">Order #${order.id}</p>
        </div>
      </td>
    </tr>

    <!-- Quick Stats -->
    <tr>
      <td style="padding:30px 40px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:30px">
          <tr>
            <td style="padding:20px;background-color:#ECFDF5;border-radius:8px;text-align:center;width:33%">
              <div style="font-size:13px;color:#065F46;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Revenue</div>
              <div style="font-size:24px;color:#059669;font-weight:700">GH₵ ${total.toFixed(2)}</div>
            </td>
            <td style="width:2%"></td>
            <td style="padding:20px;background-color:#EFF6FF;border-radius:8px;text-align:center;width:33%">
              <div style="font-size:13px;color:#1E40AF;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Items</div>
              <div style="font-size:24px;color:#2563EB;font-weight:700">${(order.items || []).length}</div>
            </td>
            <td style="width:2%"></td>
            <td style="padding:20px;background-color:#F3F4F6;border-radius:8px;text-align:center;width:33%">
              <div style="font-size:13px;color:#4B5563;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Status</div>
              <div style="font-size:18px;color:#111827;font-weight:700">${order.status}</div>
            </td>
          </tr>
        </table>

        <!-- Customer Info -->
        <div style="background-color:#F9FAFB;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid ${brandColor}">
          <h3 style="margin:0 0 16px;font-size:15px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.5px">Customer Details</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6B7280;width:120px">Email</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600">${order.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6B7280">Order Date</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600">${orderDate}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#6B7280">Reference</td>
              <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600">${order.reference || "—"}</td>
            </tr>
          </table>
        </div>

        <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#111827">Order Items</h2>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:30px;background-color:#ffffff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
          <thead>
            <tr style="background-color:#F9FAFB;border-bottom:2px solid #E5E7EB">
              <th style="padding:12px;text-align:left;font-size:13px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Item</th>
              <th style="padding:12px;text-align:right;font-size:13px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="background-color:#111827;border-radius:8px;padding:24px;color:#ffffff">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;font-size:16px;color:#D1D5DB">Subtotal</td>
              <td style="padding:8px 0;text-align:right;font-size:16px;font-weight:600">GH₵ ${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:16px;color:#D1D5DB">Shipping</td>
              <td style="padding:8px 0;text-align:right;font-size:16px;font-weight:600">GH₵ ${shipping.toFixed(2)}</td>
            </tr>
            <tr style="border-top:2px solid #374151">
              <td style="padding:16px 0 0;font-size:20px;font-weight:700">Total</td>
              <td style="padding:16px 0 0;text-align:right;font-size:24px;font-weight:700;color:${successColor}">GH₵ ${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${order.address ? `
        <div style="margin-top:30px;padding:20px;background-color:#FEF3C7;border-radius:8px;border-left:4px solid #F59E0B">
          <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.5px">Shipping Address</h3>
          <p style="margin:0;font-size:15px;color:#78350F;line-height:1.6">${order.address}</p>
        </div>
        ` : ''}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:30px 40px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;text-align:center">
        <p style="margin:0;font-size:13px;color:#6B7280">
          Admin notification • Order #${order.id} • ${orderDate}
        </p>
      </td>
    </tr>
  `;

  const userHtml = emailWrapper(userContent, false);
  const adminHtml = emailWrapper(adminContent, true);

  try {
    // Send to user
    if (order.email) {
      console.log(`📤 Sending email to user: ${order.email}`);
      console.log(`   From: ${fromAddress}`);
      const userResult = await resend.emails.send({
        from: fromAddress,
        to: order.email,
        subject: `✓ Order Confirmation #${order.id}`,
        html: userHtml,
      });
      console.log("✅ User email sent:", JSON.stringify(userResult, null, 2));
    } else {
      console.warn("⚠️ No customer email in order");
    }

    // Send to admin
    if (adminEmail) {
      console.log(`📤 Sending email to admin: ${adminEmail}`);
      console.log(`   From: ${fromAddress}`);
      const adminResult = await resend.emails.send({
        from: fromAddress,
        to: adminEmail,
        subject: `🛍️ New Order #${order.id} - GH₵ ${total.toFixed(2)}`,
        html: adminHtml,
      });
      console.log("✅ Admin email sent:", JSON.stringify(adminResult, null, 2));
    }

    console.log("🎉 Order emails sent successfully ✅");
  } catch (err) {
    console.error("❌ Error sending order emails:", err?.message || err);
    console.error("Full error object:", JSON.stringify(err, null, 2));
    if (err?.response) {
      console.error("Error response:", JSON.stringify(err.response, null, 2));
    }
  }
}

export default { sendOrderEmails };