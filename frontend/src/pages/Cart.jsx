import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/CartStore";
import { ShopContext } from "../context/ShopContext";
import AssetImage from "../components/AssetImage";

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
    <section className="page-x section-y">
      <div className="mb-10 flex items-end justify-between border-b border-[#DBCCB7]/60 pb-8">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="editorial-serif mt-3 text-4xl font-semibold">Shopping Cart</h1>
        </div>
        <p className="hidden text-sm text-[#6f5860] sm:block">{cartData.length} item{cartData.length === 1 ? "" : "s"}</p>
      </div>

      {cartData.length === 0 ? (
        <div className="mx-auto grid max-w-md place-items-center py-20 text-center">
          <AssetImage asset={assets.cart_icon} className="mb-5 w-14 text-[#5A0019]" alt="Empty cart" />
          <p className="font-semibold text-[#6f5860]">Your cart is empty</p>
          <button onClick={() => navigate("/collection")} className="btn-secondary mt-6">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="divide-y divide-[#DBCCB7]/60 border-y border-[#DBCCB7]/60">
        {cartData.map((item) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="grid grid-cols-[1fr_auto] items-center gap-5 py-5 text-[#1d1115] md:grid-cols-[1fr_160px_100px_40px]"
            >
              <div className="flex gap-5">
                <AssetImage className="h-24 w-20 object-cover" asset={product.image?.[0]} alt={product.name} />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-2 text-sm text-[#6f5860]">Size: {item.size}</p>
                  <p>
                    {currency}
                    {product.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseItem(item._id, item.size)}
                  className="grid h-9 w-9 place-items-center border border-[#DBCCB7] text-lg hover:border-[#5A0019]"
                >
                  -
                </button>
                <span className="w-7 text-center">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item._id, item.size)}
                  className="grid h-9 w-9 place-items-center border border-[#DBCCB7] text-lg hover:border-[#5A0019]"
                >
                  +
                </button>
              </div>

              <p className="text-right text-sm font-bold sm:text-base">
                {currency}
                {product.price * item.quantity}
              </p>

              <AssetImage
                asset={assets.bin_icon}
                alt="Remove"
                className="w-5 sm:w-6 cursor-pointer hover:opacity-60"
                onClick={() => removeFromCart(item._id, item.size)}
              />
            </div>
          );
        })}
          </div>

          <aside className="h-fit border border-[#DBCCB7] bg-white p-6">
            <p className="editorial-serif mb-5 text-2xl font-semibold">Order summary</p>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <p className="text-[#6f5860]">Subtotal</p>
                <p>{currency}{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#6f5860]">Shipping</p>
                <p>{currency}{shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-[#DBCCB7]/60 pt-4 text-base font-bold">
                <p>Total</p>
                <p>{currency}{total.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/place-order")}
              className="btn-primary mt-8 w-full"
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;
