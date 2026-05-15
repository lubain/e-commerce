import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'
import { PROMO_CODES } from '@/lib/data'

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  promoDiscount: number

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyPromoCode: (code: string) => { success: boolean; message: string }
  removePromoCode: () => void

  // Computed
  getSubtotal: () => number
  getDiscount: () => number
  getShipping: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === product.id &&
              item.variantId === variant?.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          const newItem: CartItem = {
            id: `${product.id}-${variant?.id ?? 'default'}-${Date.now()}`,
            productId: product.id,
            product,
            variantId: variant?.id,
            variant,
            quantity,
            price: product.price + (variant?.priceModifier ?? 0),
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      applyPromoCode: (code) => {
        const promo = PROMO_CODES.find(
          (p) => p.code.toLowerCase() === code.toLowerCase()
        )

        if (!promo) {
          return { success: false, message: 'Code promo invalide' }
        }

        const subtotal = get().getSubtotal()
        if (promo.minOrderValue && subtotal < promo.minOrderValue) {
          return {
            success: false,
            message: `Commande minimum de ${promo.minOrderValue}€ requise`,
          }
        }

        let discount = 0
        if (promo.discountType === 'percentage') {
          discount = (subtotal * promo.discountValue) / 100
        } else {
          discount = promo.discountValue
        }

        set({ promoCode: promo.code, promoDiscount: discount })
        return {
          success: true,
          message: `Code appliqué : -${promo.discountType === 'percentage' ? promo.discountValue + '%' : promo.discountValue + '€'}`,
        }
      },

      removePromoCode: () => set({ promoCode: null, promoDiscount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getDiscount: () => get().promoDiscount,

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 300 ? 0 : 15
      },

      getTotal: () => {
        const { getSubtotal, getDiscount, getShipping } = get()
        return Math.max(0, getSubtotal() - getDiscount() + getShipping())
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'lumiere-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
