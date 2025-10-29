import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { products } from '../assets/assets';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: {},

      // ➕ Add item or increase quantity
      addToCart: (itemId, size) => {
        if (!size) {
          toast.error('Select product size');
          return;
        }

        const cartData = structuredClone(get().cartItems);

        if (cartData[itemId]) {
          cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
          cartData[itemId] = { [size]: 1 };
        }

        set({ cartItems: cartData });
        toast.success('Item added to cart');
      },

      // ➖ Decrease quantity
      decreaseQuantity: (itemId, size) => {
        const cartData = structuredClone(get().cartItems);

        if (cartData[itemId] && cartData[itemId][size]) {
          if (cartData[itemId][size] > 1) {
            cartData[itemId][size] -= 1;
          } else {
            delete cartData[itemId][size];
            toast.info('Item removed from cart');
          }

          // If product has no sizes left, remove product entirely
          if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }

          set({ cartItems: cartData });
        }
      },

      // 🗑️ Remove item completely
      removeFromCart: (itemId, size) => {
        const cartData = structuredClone(get().cartItems);

        if (cartData[itemId] && cartData[itemId][size]) {
          delete cartData[itemId][size];
          toast.info('Item removed from cart');

          // If no sizes left, remove product entirely
          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }

          set({ cartItems: cartData });
        }
      },

      // 🔢 Get total item count
      getCartCount: () => {
        let totalCount = 0;
        const cart = get().cartItems;
        for (const productId in cart) {
          for (const size in cart[productId]) {
            totalCount += cart[productId][size];
          }
        }
        return totalCount;
      },

      // 💰 Get total price
      getCartAmount: () => {
        let totalAmount = 0;
        const cart = get().cartItems;

        for (const itemId in cart) {
          const itemInfo = products.find((p) => p._id === itemId);
          if (!itemInfo) continue;

          for (const size in cart[itemId]) {
            totalAmount += itemInfo.price * cart[itemId][size];
          }
        }

        return totalAmount;
      },

      // 🧹 Clear entire cart
      clearCart: () => {
        set({ cartItems: {} });
        toast.info('Cart cleared');
      },
    }),
    {
      name: 'cart-storage', // key name in localStorage
      getStorage: () => localStorage,
    }
  )
);
