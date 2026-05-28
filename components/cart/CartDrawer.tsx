"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice, cn } from "@/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = useCartStore((s) => s.getShipping());
  const total = useCartStore((s) => s.getTotal());

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-background border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--gold)]" />
                <h2 className="font-serif text-lg font-light tracking-wide">
                  Mon Panier
                </h2>
                {items.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({items.length} article{items.length > 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Votre panier est vide</p>
                    <p className="text-sm text-muted-foreground">
                      Découvrez nos collections
                    </p>
                  </div>
                  <Link
                    href="/boutique"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[var(--gold)] text-background rounded-full text-sm font-semibold"
                  >
                    Explorer la boutique
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex gap-4 p-4 bg-secondary/50 rounded-xl border border-border/50"
                  >
                    {/* Image */}
                    <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        {item.product.category.name}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center gap-2">
                          <button
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Sous-total</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Livraison</span>
                  <span
                    className={cn(
                      "font-mono",
                      shipping === 0 && "text-emerald-400",
                    )}
                  >
                    {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border">
                  <span>Total TTC</span>
                  <span className="font-mono text-lg">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <Link href="/checkout" onClick={onClose}>
                    <motion.div
                      className="w-full bg-[var(--gold)] text-background rounded-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Commander <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Link>
                  <Link href="/panier" onClick={onClose}>
                    <div className="w-full border border-border rounded-full py-3 text-sm text-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                      Voir le panier
                    </div>
                  </Link>
                </div>

                {subtotal < 300 && (
                  <p className="text-center text-xs text-muted-foreground">
                    Plus que{" "}
                    <span className="text-[var(--gold)] font-medium">
                      {formatPrice(300 - subtotal)}
                    </span>{" "}
                    pour la livraison gratuite
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
