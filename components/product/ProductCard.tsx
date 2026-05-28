"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { formatPrice, calculateDiscount, cn } from "@/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success("Ajouté au panier", {
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    toast(added ? "❤️ Ajouté à la wishlist" : "🤍 Retiré de la wishlist", {
      description: product.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/produit/${product.slug}`}>
        <div
          className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/30 hover:shadow-premium"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
            {product.images[0] && (
              <Image
                src={product.images[imgIdx]?.url ?? product.images[0].url}
                alt={product.images[0].alt}
                fill
                className={cn(
                  "object-cover transition-transform duration-700",
                  isHovered ? "scale-105" : "scale-100",
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Nouveau
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/30">
                  -{discount}%
                </span>
              )}
              {product.isFeatured && !product.isNew && discount === 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                  Tendance
                </span>
              )}
            </div>

            {/* Actions overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20"
                />
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <motion.button
                className={cn(
                  "w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center transition-all",
                  isInWishlist
                    ? "text-red-400"
                    : "text-white/70 hover:text-red-400",
                )}
                onClick={handleWishlist}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 10 }}
                animate={
                  isHovered
                    ? { opacity: 1, x: 0 }
                    : { opacity: isInWishlist ? 1 : 0, x: 10 }
                }
                transition={{ duration: 0.15 }}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={
                  isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }
                }
                transition={{ duration: 0.15, delay: 0.04 }}
              >
                <Link href={`/produit/${product.slug}`}>
                  <div className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Image dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === imgIdx ? "bg-white w-4" : "bg-white/50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setImgIdx(i);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
              {product.category.name}
            </p>
            <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-1">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3 h-3",
                      star <= Math.round(product.rating)
                        ? "text-[var(--gold)] fill-[var(--gold)]"
                        : "text-muted-foreground",
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-base font-medium">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-xs text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <motion.button
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  "border border-border hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-background",
                  "text-muted-foreground",
                )}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Panier</span>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
