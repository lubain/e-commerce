import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => boolean // returns true if added
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      toggleItem: (product) => {
        const isIn = get().isInWishlist(product.id)
        if (isIn) {
          get().removeItem(product.id)
          return false
        } else {
          get().addItem(product)
          return true
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'lumiere-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
