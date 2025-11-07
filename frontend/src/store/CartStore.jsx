import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { products } from '../assets/assets';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: {},

      addToCart: (itemId, size) => {
        if (!size) {
          toast.error('Select product size');
          return;
        }

        set((state) => {
          const cart = { ...state.cartItems };

          if (!cart[itemId]) {
            cart[itemId] = {};
          }

          cart[itemId] = {
            ...cart[itemId],
            [size]: (cart[itemId][size] || 0) + 1,
          };

          toast.success('Item added to cart');
          return { cartItems: cart };
        });
      },

      decreaseQuantity: (itemId, size) => {
        set((state) => {
          const cart = { ...state.cartItems };
          const currentQty = cart[itemId]?.[size];

          if (!currentQty) return state;

          if (currentQty > 1) {
            cart[itemId] = { ...cart[itemId], [size]: currentQty - 1 };
          } else {
            delete cart[itemId][size];
            toast.info('Item removed from cart');
          }

          if (Object.keys(cart[itemId]).length === 0) {
            delete cart[itemId];
          }

          return { cartItems: cart };
        });
      },

      removeFromCart: (itemId, size) => {
        set((state) => {
          const cart = { ...state.cartItems };

          if (cart[itemId]?.[size]) {
            delete cart[itemId][size];
            toast.info('Item removed from cart');

            if (Object.keys(cart[itemId]).length === 0) {
              delete cart[itemId];
            }
          }

          return { cartItems: cart };
        });
      },

      getCartCount: () => {
        const cart = get().cartItems;
        let totalCount = 0;

        for (const productId in cart) {
          for (const size in cart[productId]) {
            totalCount += cart[productId][size];
          }
        }

        return totalCount;
      },

      getCartAmount: () => {
        const cart = get().cartItems;
        let totalAmount = 0;

        for (const itemId in cart) {
          const itemInfo = products.find((p) => p._id === itemId);
          if (!itemInfo) continue;

          for (const size in cart[itemId]) {
            totalAmount += itemInfo.price * cart[itemId][size];
          }
        }

        return totalAmount;
      },

      clearCart: () => {
        set({ cartItems: {} });
        toast.info('Cart cleared');
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);
