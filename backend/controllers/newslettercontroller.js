import validator from "validator";
import { eq } from "drizzle-orm";
import { db, newsletterSubscribers } from "../db/index.js";

export const subscribeToNewsletter = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const source = String(req.body.source || "homepage").trim().slice(0, 80) || "homepage";

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: "You're already on the list.",
        alreadySubscribed: true,
      });
    }

    await db.insert(newsletterSubscribers).values({ email, source });

    return res.status(201).json({
      success: true,
      message: "You're on the list. We'll keep you posted.",
    });
  } catch (error) {
    if (error?.code === "23505") {
      return res.json({
        success: true,
        message: "You're already on the list.",
        alreadySubscribed: true,
      });
    }

    console.error("subscribeToNewsletter error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: "We could not join you to the list right now. Please try again.",
    });
  }
};

export default { subscribeToNewsletter };
