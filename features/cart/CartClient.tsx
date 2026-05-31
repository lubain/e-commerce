"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Tag,
  Gift,
  Truck,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/utils";

export function CartClient() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromoCode = useCartStore((s) => s.applyPromoCode);
  const removePromoCode = useCartStore((s) => s.removePromoCode);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const discount = useCartStore((s) => s.getDiscount());
  const shipping = useCartStore((s) => s.getShipping());
  const total = useCartStore((s) => s.getTotal());
  const promoCode = useCartStore((s) => s.promoCode);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = applyPromoCode(promoInput);
    setPromoLoading(false);
    if (result.success) {
      toast.success(result.message);
      setPromoInput("");
    } else {
      toast.error(result.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container px-4 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6"
        >
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </motion.div>
        <h1 className="font-serif text-3xl font-light mb-3">
          Votre panier est vide
        </h1>
        <p className="text-muted-foreground mb-8">
          Découvrez nos collections et ajoutez vos pièces préférées.
        </p>
        <Link href="/boutique">
          <motion.div
            className="px-8 py-3.5 bg-[var(--gold)] text-background rounded-full text-sm font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explorer la boutique <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/boutique"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Continuer mes achats
        </Link>
        <div className="flex-1 h-px bg-border" />
        <h1 className="font-serif text-2xl font-light">
          Mon Panier{" "}
          <span className="font-mono text-lg text-muted-foreground">
            ({items.reduce((n, i) => n + i.quantity, 0)})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-5 p-5 bg-card border border-border rounded-2xl"
              >
                {/* Image */}
                <Link
                  href={`/produit/${item.product.slug}`}
                  className="flex-shrink-0"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
                        {item.product.category.name}
                      </p>
                      <Link href={`/produit/${item.product.slug}`}>
                        <p className="font-medium text-sm hover:text-[var(--gold)] transition-colors">
                          {item.product.name}
                        </p>
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variant.name} : {item.variant.value}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} / unité
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty */}
                    <div className="flex items-center gap-2 border border-border rounded-xl px-2">
                      <button
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <motion.button
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        removeItem(item.id);
                        toast("Article supprimé", {
                          description: item.product.name,
                        });
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Free shipping progress */}
          {shipping > 0 && (
            <motion.div
              layout
              className="p-4 bg-secondary/50 border border-border rounded-2xl"
            >
              <div className="flex items-center gap-2 text-sm mb-2">
                <Truck className="w-4 h-4 text-[var(--gold)]" />
                <span>
                  Plus que{" "}
                  <strong className="text-[var(--gold)]">
                    {formatPrice(300 - subtotal)}
                  </strong>{" "}
                  pour la livraison gratuite
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--gold)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (subtotal / 300) * 100)}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Récapitulatif
            </h2>

            {/* Promo */}
            {promoCode ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <Tag className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-mono text-emerald-400">
                    {promoCode}
                  </p>
                  <p className="text-xs text-emerald-400">
                    -{formatPrice(discount)} de réduction
                  </p>
                </div>
                <button
                  onClick={() => {
                    removePromoCode();
                    toast("Code promo retiré");
                  }}
                  className="text-emerald-400/50 hover:text-emerald-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-secondary border border-border rounded-xl px-3">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    placeholder="Code promo"
                    className="flex-1 bg-transparent text-sm outline-none py-2.5 font-mono placeholder:text-muted-foreground"
                  />
                </div>
                <motion.button
                  className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm font-medium hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                >
                  {promoLoading ? "…" : "Appliquer"}
                </motion.button>
              </div>
            )}

            {/* Gift */}
            <button className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl p-3">
              <Gift className="w-4 h-4" />
              Ajouter un message cadeau
            </button>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Sous-total</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Réduction</span>
                  <span className="font-mono">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Livraison</span>
                <span
                  className={`font-mono ${shipping === 0 ? "text-emerald-400" : ""}`}
                >
                  {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-medium">
                <span>Total TTC</span>
                <span className="font-mono text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <motion.div
                className="w-full bg-[var(--gold)] text-background rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 30px rgba(201,169,110,0.3)",
                }}
                whileTap={{ scale: 0.99 }}
              >
                Passer la commande <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              Paiement sécurisé · SSL 256-bit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
