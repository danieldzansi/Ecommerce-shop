import React, { useEffect, useState, useContext } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/CartStore';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { products, currency } = useContext(ShopContext);
  const { cartItems, addToCart, removeFromCart, getCartAmount } = useCartStore();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  // 🧩 Update cart display whenever Zustand cart changes
  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity,
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  // ➕ Increase quantity
  const handleIncrease = (productId, size) => {
    addToCart(productId, size);
  };

  // ➖ Decrease quantity
  const handleDecrease = (productId, size) => {
    const currentQty = cartItems[productId]?.[size];
    if (currentQty && currentQty > 1) {
      const updated = structuredClone(cartItems);
      updated[productId][size] -= 1;
      useCartStore.setState({ cartItems: updated });
    } else {
      removeFromCart(productId, size);
    }
  };

  // 🗑️ Remove item completely
  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
  };

  // 💰 Get totals directly from Zustand
  const subtotal = getCartAmount();
  const shipping = cartData.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // 🛒 Render cart items
  return (
    <div className="pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((p) => p._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_1fr_0.5fr] items-center gap-4"
              >
                {/* 🛍️ Product Info */}
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={productData.image[0]} alt="" />
                  <div className="text-xs sm:text-lg font-medium">
                    <p>{productData.name}</p>
                    <p className="text-gray-500 text-sm">Size: {item.size}</p>
                    <p className="text-gray-900">
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>

                {/* 🔢 Quantity Counter */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={item.quantity === 1}
                    onClick={() => handleDecrease(item._id, item.size)}
                    className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-l-lg"
                  >
                    -
                  </button>
                  <div className="px-4 py-1 text-lg border-t border-b border-gray-300">
                    {item.quantity}
                  </div>
                  <button
                    onClick={() => handleIncrease(item._id, item.size)}
                    className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm sm:text-lg font-semibold">
                  {currency}
                  {productData.price * item.quantity}
                </p>

                {/* 🗑️ Remove */}
                <img
                  src={assets.bin_icon}
                  alt="Remove"
                  className="w-5 sm:w-6 cursor-pointer hover:opacity-60"
                  onClick={() => handleRemove(item._id, item.size)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* 🧾 Total Summary Section */}
      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px] border-t pt-6">
            <div className="flex justify-between mb-3 text-sm">
              <p>Subtotal</p>
              <p>
                {currency}
                {subtotal.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <p>Shipping Fee</p>
              <p>
                {currency}
                {shipping.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <p>Total</p>
              <p>
                {currency}
                {total.toFixed(2)}
              </p>
            </div>

            <div className="w-full text-end">
              <button
                onClick={() => navigate('/place-order')}
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
