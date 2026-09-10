import React, { useState } from "react";
import { DEFAULT_CART_VARIANT, parseCartVariantKey, useCartStore } from "../store/CartStore";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { paymentMethods } from "../assets/paymentMethods";

const PAYSTACK_GHANA_FEE_RATE = 0.0195;

const getPaystackGrossAmount = (amount) => {
  if (!amount) return 0;
  return Number((amount / (1 - PAYSTACK_GHANA_FEE_RATE)).toFixed(2));
};

const PlaceOrder = () => {
  const { currency, delivery_fee, products } = useContext(ShopContext);
  const cartItems = useCartStore((state) => state.cartItems);
  const [fulfillmentMethod, setFulfillmentMethod] = useState("delivery");
  const isPickup = fulfillmentMethod === "pickup";
  const fulfillmentFee = isPickup ? 0 : delivery_fee;

  const subtotal = Object.keys(cartItems).reduce((acc, productId) => {
    const prod = products.find(
      (p) => p._id === productId || p.id === productId
    );
    if (!prod) return acc;
    for (const variantKey in cartItems[productId]) {
      acc += prod.price * cartItems[productId][variantKey];
    }
    return acc;
  }, 0);
  const payableBeforeProcessing = subtotal + fulfillmentFee;
  const totalAmountWithProcessing = getPaystackGrossAmount(payableBeforeProcessing);
  const processingFee = Math.max(0, totalAmountWithProcessing - payableBeforeProcessing);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    region: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subtotal === 0) {
      alert("Your cart is empty!");
      return;
    }

    const items = [];
    for (const productId in cartItems) {
      const product = products.find(
        (p) => p._id === productId || p.id === productId
      );
      if (!product) continue;
      for (const variantKey in cartItems[productId]) {
        const options = parseCartVariantKey(variantKey);
        const quantity = cartItems[productId][variantKey];
        items.push({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity,
          size: options.size === DEFAULT_CART_VARIANT ? "" : options.size,
          colorName: options.colorName,
          colorValue: options.colorValue,
          image: options.image || (Array.isArray(product.image)
            ? product.image[0]
            : product.image || null),
        });
      }
    }

    const deliveryDetails = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      street: isPickup ? "" : formData.street.trim(),
      city: isPickup ? "" : formData.city.trim(),
      region: isPickup ? "" : formData.region.trim(),
      country: "Ghana",
      fulfillmentMethod,
      pickupLocation: isPickup ? "Eclat De Lee store pickup" : "",
      processingFee,
      paystackFeeRate: PAYSTACK_GHANA_FEE_RATE,
    };

    const address = isPickup
      ? [
          `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
          deliveryDetails.phone,
          "Store pickup",
          "Eclat De Lee",
          "Ghana",
        ]
          .filter(Boolean)
          .join(", ")
      : [
          `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
          deliveryDetails.phone,
          deliveryDetails.street,
          deliveryDetails.city,
          deliveryDetails.region,
          "Ghana",
        ]
          .filter(Boolean)
          .join(", ");

    const totalAmount = totalAmountWithProcessing;

    try {
      setLoading(true);

      const rawBackend = import.meta.env.VITE_BACKEND_URL || "";
      const backend = rawBackend.replace(/\/$/, "") || "http://localhost:4000";
      const url = new URL("/api/paystack/initialize", backend).toString();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: formData.email,
          address,
          deliveryDetails,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        console.error("Paystack init error:", data);
        alert("Payment initialization failed.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err?.message || err);
      alert("Error initializing payment. See console for details.");
      setLoading(false);
    }
  };

  return (
    <section className="page-x section-y">
      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_420px]"
      >
      <div>
        <p className="eyebrow">Checkout</p>
        <h1 className="editorial-serif mt-3 text-4xl font-semibold">How would you like your order?</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#6f5860]">
          Choose delivery to your address or collect your pieces from our store when they are ready.
        </p>

        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={() => setFulfillmentMethod("delivery")}
            className={`flex gap-4 border p-5 text-left transition ${
              fulfillmentMethod === "delivery"
                ? "border-[#5A0019] bg-[#5A0019]/5"
                : "border-[#DBCCB7] bg-white hover:border-[#5A0019]/50"
            }`}
          >
            <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
              fulfillmentMethod === "delivery" ? "border-[#5A0019]" : "border-[#DBCCB7]"
            }`}>
              {fulfillmentMethod === "delivery" && <span className="h-3 w-3 rounded-full bg-[#5A0019]" />}
            </span>
            <span>
              <span className="block text-lg font-extrabold text-[#1d1115]">Deliver to me</span>
              <span className="mt-1 block text-sm leading-6 text-[#6f5860]">
                Send my order to my address within Ghana.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentMethod("pickup")}
            className={`flex gap-4 border p-5 text-left transition ${
              fulfillmentMethod === "pickup"
                ? "border-[#5A0019] bg-[#5A0019]/5"
                : "border-[#DBCCB7] bg-white hover:border-[#5A0019]/50"
            }`}
          >
            <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
              fulfillmentMethod === "pickup" ? "border-[#5A0019]" : "border-[#DBCCB7]"
            }`}>
              {fulfillmentMethod === "pickup" && <span className="h-3 w-3 rounded-full bg-[#5A0019]" />}
            </span>
            <span>
              <span className="block text-lg font-extrabold text-[#1d1115]">Collect from store</span>
              <span className="mt-1 block text-sm leading-6 text-[#6f5860]">
                We will contact you when your order is ready for pickup.
              </span>
            </span>
          </button>
        </div>

        <div className="mt-8 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            className="form-field"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            className="form-field"
            required
          />
        </div>

        <input
          type="text"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="form-field"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          className="form-field"
          required
        />

        {!isPickup ? (
          <>
            <input
              type="text"
              name="street"
              placeholder="Street address"
              value={formData.street}
              onChange={handleChange}
              className="form-field"
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="city"
                placeholder="City / town"
                value={formData.city}
                onChange={handleChange}
                className="form-field"
                required
              />
              <input
                type="text"
                name="region"
                placeholder="Region"
                value={formData.region}
                onChange={handleChange}
                className="form-field"
                required
              />
            </div>
          </>
        ) : (
          <div className="border border-[#DBCCB7] bg-[#f7f1ea] p-5 text-sm leading-6 text-[#5A0019]">
            Pickup orders are confirmed online. Our team will call or message you with collection details once your order is ready.
          </div>
        )}
        </div>
      </div>

      <aside className="h-fit border border-[#DBCCB7] bg-white p-6">
        <div>
          <p className="editorial-serif mb-5 text-2xl font-semibold">Order summary</p>
          <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <p className="text-[#6f5860]">Subtotal</p>
            <p>
              {currency}
              {subtotal.toFixed(2)}
            </p>
          </div>
          <hr className="border-[#DBCCB7]/60" />
          <div className="flex justify-between">
            <p className="text-[#6f5860]">{isPickup ? "Pickup" : "Delivery"}</p>
            <p>
              {currency}
              {fulfillmentFee.toFixed(2)}
            </p>
          </div>
          <hr className="border-[#DBCCB7]/60" />
          <div className="flex justify-between">
            <p className="text-[#6f5860]">Payment processing</p>
            <p>
              {currency}
              {processingFee.toFixed(2)}
            </p>
          </div>
          <hr className="border-[#DBCCB7]/60" />
          <div className="flex justify-between text-base font-bold">
            <p>Total</p>
            <p>
              {currency}
              {totalAmountWithProcessing.toFixed(2)}
            </p>
          </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em]">Payment method</p>
          <div className="border border-[#DBCCB7] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-4 w-4 place-items-center rounded-full border border-[#5A0019]">
                <span className="h-2 w-2 rounded-full bg-[#5A0019]" />
              </span>
              <p className="text-sm font-bold">Online payment</p>
            </div>
            <div className="mt-5 border-t border-[#DBCCB7]/60 pt-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6f5860]">
                Accepted payment methods
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {paymentMethods.map((method) => (
                  <img
                    key={method.name}
                    src={method.logo}
                    alt={method.name}
                    className={`${method.className} max-w-[90px] object-contain grayscale`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                "Pay online"
              )}
            </button>
          </div>
        </div>
      </aside>
    </form>
    </section>
  );
};

export default PlaceOrder;
