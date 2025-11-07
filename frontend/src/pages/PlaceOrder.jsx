import React, { useState } from "react";
import Title from "../components/Title";
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
    state: "",
    zipcode: "",
    country: "",
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

    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}, ${formData.zipcode}`;
    const totalAmount = subtotal + delivery_fee;

    try {
      setLoading(true);

      const rawBackend = import.meta.env.VITE_BACKEND_URL ;
      const url = new URL("/api/paystack/initialize", rawBackend).toString();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: formData.email,
          address,
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[800px] border-t"
    >
      <div className="flex flex-col gap-4 w-full sm-max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />

        <div className="flex gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            name="zipcode"
            placeholder="Zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
      </div>
      <div className="mt-8 w-full sm:w-[400px]">
        <div className="border p-4 rounded flex flex-col gap-2">
          <Title text1="CART" text2="TOTAL" />
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>
              {currency}
              {subtotal}.00
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>
              {currency}
              {delivery_fee}
            </p>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>
              {currency}
              {subtotal + delivery_fee}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row mt-2">
            
            <div className="flex items-center gap-3 p-2 px-3 cursor-pointer border rounded">
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white text-sm my-8 px-8 py-3 flex items-center justify-center disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </span>
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
