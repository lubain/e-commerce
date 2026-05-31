"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { ProductCard } from "@/components/product/ProductCard";
import { toast } from "sonner";

export function WishlistClient() {
  const items = useWishlistStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const addAllToCart = () => {
    items.forEach((p) => addItem(p));
    toast.success(`${items.length} articles ajoutés au panier`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light mb-1">Ma Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} article{items.length !== 1 ? "s" : ""} sauvegardé
            {items.length !== 1 ? "s" : ""}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-3">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:bg-secondary transition-colors text-muted-foreground"
              whileTap={{ scale: 0.97 }}
              onClick={clearWishlist}
            >
              Vider la liste
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-background rounded-xl text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addAllToCart}
            >
              <ShoppingBag className="w-4 h-4" /> Tout ajouter au panier
            </motion.button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-light mb-2">
            Votre wishlist est vide
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sauvegardez vos pièces coup de cœur pour les retrouver facilement.
          </p>
          <Link href="/boutique">
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-background rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.03 }}
            >
              Découvrir la boutique
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
