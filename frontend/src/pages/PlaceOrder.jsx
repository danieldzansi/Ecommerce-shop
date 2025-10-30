import React, { useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
// removed unused useNavigate; payment flow redirects to Paystack
import { useCartStore } from '../store/CartStore';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { products } from '../assets/assets';

const PlaceOrder = () => {
  // navigation handled by Paystack redirect after initialization
  const { currency, delivery_fee } = useContext(ShopContext);
  const getCartAmount = useCartStore((state) => state.getCartAmount);
  const cartItems = useCartStore((state) => state.cartItems);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (getCartAmount() === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Build items array from cart state
    const items = [];
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;
      let quantity = 0;
      for (const size in cartItems[productId]) {
        quantity += cartItems[productId][size];
      }
      items.push({ name: product.name, price: product.price, quantity });
    }

    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}, ${formData.zipcode}`;
    const totalAmount = getCartAmount() + delivery_fee;

    try {
      const response = await fetch('http://localhost:4000/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email: formData.email, address, totalAmount }),
      });

      const data = await response.json();
      if (response.ok && data.authorization_url) {
        // Redirect user to Paystack checkout
        window.location.href = data.authorization_url;
      } else {
        console.error('Paystack init error:', data);
        alert('Payment initialization failed.');
      }
    } catch (err) {
      console.error(err?.message || err);
      alert('Error initializing payment. See console for details.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[800px] border-t"
    >
      
      <div className="flex flex-col gap-4 w-full sm-max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className="flex gap-3">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
           <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
        </div>

         <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
        <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>

        <div className="flex gap-3">
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
           <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
        </div>

        <div className="flex gap-3">
           <input type="number" name="zipcode" placeholder="Zipcode" value={formData.zipcode} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
           <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
        </div>

        <input type="number" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required/>
      </div>

      {/* ORDER SUMMARY + PAYMENT */}
      <div className="mt-8 w-full sm:w-[400px]">
        <div className="border p-4 rounded flex flex-col gap-2">
          <Title text1="CART" text2="TOTAL" />
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{currency}{getCartAmount()}.00</p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>{currency}{delivery_fee}</p>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>{currency}{getCartAmount() + delivery_fee}</p>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row mt-2">
            <div className="flex items-center gap-3 p-2 px-3 cursor-pointer border rounded">
              <img className="h-5 mx-5" src={assets.stripe_logo} alt="" />
            </div>
            <div className="flex items-center gap-3 p-2 px-3 cursor-pointer border rounded">
              <img className="h-5 mx-5" src={assets.razorpay_logo} alt="" />
            </div>
            <div className="flex items-center gap-3 p-2 px-3 cursor-pointer border rounded">
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
