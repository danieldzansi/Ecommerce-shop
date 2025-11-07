import React, { useContext } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency } = useContext(ShopContext);
  const { cartItems, addToCart, removeFromCart, decreaseItem } = useCartStore();
  const navigate = useNavigate();

  const cartData = Object.entries(cartItems).flatMap(([productId, sizes]) =>
    Object.entries(sizes).map(([size, quantity]) => ({
      _id: productId,
      size,
      quantity,
    }))
  );

  const subtotal = cartData.reduce((acc, item) => {
    const product = products.find((p) => p._id === item._id);
    return product ? acc + product.price * item.quantity : acc;
  }, 0);

  const shipping = cartData.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
      ) : (
        cartData.map((item) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="py-4 border-t border-b grid grid-cols-[4fr_2fr_1fr_0.5fr] items-center gap-4 text-gray-700"
            >
              <div className="flex gap-6">
                <img className="w-16 sm:w-20" src={product.image[0]} alt="" />
                <div className="text-xs sm:text-lg">
                  <p>{product.name}</p>
                  <p className="text-gray-500 text-sm">Size: {item.size}</p>
                  <p>
                    {currency}
                    {product.price}
                  </p>
                </div>
              </div>

              {/* Quantity Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseItem(item._id, item.size)}
                  className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item._id, item.size)}
                  className="px-3 py-1 text-lg bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <p className="text-sm sm:text-lg font-semibold">
                {currency}
                {product.price * item.quantity}
              </p>

              <img
                src={assets.bin_icon}
                alt="Remove"
                className="w-5 sm:w-6 cursor-pointer hover:opacity-60"
                onClick={() => removeFromCart(item._id, item.size)}
              />
            </div>
          );
        })
      )}

      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px] border-t pt-6">
            <div className="flex justify-between mb-3 text-sm">
              <p>Subtotal</p>
              <p>{currency}{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <p>Shipping Fee</p>
              <p>{currency}{shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <p>Total</p>
              <p>{currency}{total.toFixed(2)}</p>
            </div>

            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3 w-full"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
