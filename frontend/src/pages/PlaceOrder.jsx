import React, { useState } from "react";
import { useCartStore } from "../store/CartStore";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const { currency, delivery_fee, products } = useContext(ShopContext);
  const cartItems = useCartStore((state) => state.cartItems);

  const subtotal = Object.keys(cartItems).reduce((acc, productId) => {
    const prod = products.find(
      (p) => p._id === productId || p.id === productId
    );
    if (!prod) return acc;
    for (const size in cartItems[productId]) {
      acc += prod.price * cartItems[productId][size];
    }
    return acc;
  }, 0);

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
      let quantity = 0;
      for (const size in cartItems[productId]) {
        quantity += cartItems[productId][size];
      }
      // include product id and a best-effort image (first image) so backend can persist for order details
      items.push({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: Array.isArray(product.image)
          ? product.image[0]
          : product.image || null,
      });
    }

    const deliveryDetails = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      region: formData.region.trim(),
      country: "Ghana",
    };

    const address = [
      `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
      deliveryDetails.phone,
      deliveryDetails.street,
      deliveryDetails.city,
      deliveryDetails.region,
      "Ghana",
    ]
      .filter(Boolean)
      .join(", ");

    const totalAmount = subtotal + delivery_fee;

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
        <h1 className="editorial-serif mt-3 text-4xl font-semibold">Delivery information</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#6f5860]">
          We currently deliver within Ghana only. Tell us where to send your pieces.
        </p>

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

        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          className="form-field"
          required
        />
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
            <p className="text-[#6f5860]">Shipping</p>
            <p>
              {currency}
              {delivery_fee.toFixed(2)}
            </p>
          </div>
          <hr className="border-[#DBCCB7]/60" />
          <div className="flex justify-between text-base font-bold">
            <p>Total</p>
            <p>
              {currency}
              {(subtotal + delivery_fee).toFixed(2)}
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
