// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ name: String, price: Number, quantity: Number }],
    email: { type: String, required: true },
    address: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    reference: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
