"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  RefreshCw,
  ChevronRight,
  Share2,
  ZoomIn,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { ProductCard } from "@/components/product/ProductCard";
import { REVIEWS } from "@/lib/data";
import { formatPrice, calculateDiscount, formatDate, cn } from "@/utils";

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "care">(
    "desc",
  );

  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0;

  const currentPrice = product.price + (selectedVariant?.priceModifier ?? 0);

  const handleAddToCart = () => {
    addItem(product, selectedVariant ?? undefined, quantity);
    toast.success("Ajouté au panier !", {
      description: `${product.name} — ${selectedVariant?.value ?? ""}`,
      action: {
        label: "Voir le panier",
        onClick: () => {},
      },
    });
  };

  const handleWishlist = () => {
    const added = toggleItem(product);
    toast(added ? "❤️ Ajouté à la wishlist" : "🤍 Retiré de la wishlist", {
      description: product.name,
    });
  };

  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/boutique"
            className="hover:text-foreground transition-colors"
          >
            Boutique
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/boutique?category=${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Main */}
      <div className="container px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border cursor-zoom-in"
              onClick={() => setZoomed(!zoomed)}
              layoutId="main-image"
            >
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500",
                    zoomed && "scale-150",
                  )}
                  priority
                />
              )}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center">
                <ZoomIn className="w-3.5 h-3.5 text-white/70" />
              </div>
              {discount > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">
                  -{discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                    i === selectedImage
                      ? "border-[var(--gold)]"
                      : "border-border hover:border-[var(--gold)]/50",
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.12em] text-[var(--gold)] uppercase mb-3">
              {product.category.name}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= Math.round(product.rating)
                        ? "text-[var(--gold)] fill-[var(--gold)]"
                        : "text-muted-foreground",
                    )}
                  />
                ))}
              </div>
              <span className="font-mono text-sm">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} avis)
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  product.stock > 5
                    ? "bg-emerald-500/10 text-emerald-400"
                    : product.stock > 0
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400",
                )}
              >
                {product.stock > 5
                  ? "✓ En stock"
                  : product.stock > 0
                    ? `⚡ Plus que ${product.stock}`
                    : "✗ Épuisé"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-mono text-3xl font-medium">
                {formatPrice(currentPrice)}
              </span>
              {product.compareAtPrice && (
                <span className="font-mono text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm text-red-400 font-medium">
                  Économisez{" "}
                  {formatPrice(product.compareAtPrice! - currentPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {product.variants[0].name} :{" "}
                  <span className="text-foreground">
                    {selectedVariant?.value}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm transition-all",
                        variant.stock === 0 && "opacity-40 cursor-not-allowed",
                        selectedVariant?.id === variant.id
                          ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                          : "border-border hover:border-[var(--gold)]/50 text-muted-foreground",
                      )}
                    >
                      {variant.value}
                      {variant.priceModifier !== 0 && (
                        <span className="ml-1 text-xs">
                          {variant.priceModifier > 0 ? "+" : ""}
                          {formatPrice(variant.priceModifier)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="flex gap-3 mb-6">
              {/* Qty */}
              <div className="flex items-center gap-2 border border-border rounded-xl px-3">
                <button
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                className="flex-1 bg-[var(--gold)] text-background rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 30px rgba(201,169,110,0.3)",
                }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier
              </motion.button>

              {/* Wishlist */}
              <motion.button
                className={cn(
                  "w-12 h-12 rounded-xl border flex items-center justify-center transition-colors",
                  isInWishlist
                    ? "border-red-400 text-red-400 bg-red-400/10"
                    : "border-border text-muted-foreground hover:border-red-400 hover:text-red-400",
                )}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
              >
                <Heart
                  className="w-[18px] h-[18px]"
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </motion.button>

              {/* Share */}
              <motion.button
                className="w-12 h-12 rounded-xl border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Lien copié !");
                }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Trust icons */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-secondary/50 rounded-xl border border-border/50 mb-8">
              {[
                { Icon: Truck, text: "Livraison offerte dès 300€" },
                { Icon: RefreshCw, text: "Retour gratuit 30 jours" },
                { Icon: Shield, text: "Paiement 100% sécurisé" },
                { Icon: Star, text: "Authenticité garantie" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-border">
          <div className="flex gap-8">
            {[
              { id: "desc", label: "Description" },
              { id: "reviews", label: `Avis (${product.reviewCount})` },
              { id: "care", label: "Entretien" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "pb-4 text-sm font-medium border-b-2 transition-colors relative -mb-px",
                  activeTab === tab.id
                    ? "border-[var(--gold)] text-[var(--gold)]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-10 max-w-3xl">
          <AnimatePresence mode="wait">
            {activeTab === "desc" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                  {product.longDescription ?? product.description}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="flex items-center gap-6 p-6 bg-secondary/50 rounded-2xl border border-border">
                  <div className="text-center">
                    <p className="font-serif text-5xl font-light text-[var(--gold)]">
                      {product.rating}
                    </p>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.reviewCount} avis
                    </p>
                  </div>
                </div>

                {productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-border/50 pb-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-background text-sm font-bold flex-shrink-0">
                        {review.user.name?.[0] ?? "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">
                            {review.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn(
                                "w-3.5 h-3.5",
                                s <= review.rating
                                  ? "text-[var(--gold)] fill-[var(--gold)]"
                                  : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                        <p className="font-medium text-sm mb-1">
                          {review.title}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.content}
                        </p>
                        {review.verified && (
                          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Achat vérifié
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "care" && (
              <motion.div
                key="care"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[
                  {
                    title: "Conservation",
                    text: "Conservez votre bijou dans l'écrin fourni, à l'abri de la lumière et de l'humidité.",
                  },
                  {
                    title: "Nettoyage",
                    text: "Nettoyez délicatement avec un chiffon doux et sec. Évitez les produits chimiques et les ultrasons.",
                  },
                  {
                    title: "Port",
                    text: "Évitez le contact avec les cosmétiques, parfums et produits ménagers.",
                  },
                  {
                    title: "Entretien professionnel",
                    text: "Un nettoyage professionnel annuel est recommandé pour maintenir l'éclat des pierres.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-secondary/50 rounded-xl border border-border"
                  >
                    <p className="font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-8 pt-12 border-t border-border">
            <h2 className="font-serif text-3xl font-light mb-8">
              Vous aimerez <em className="italic">aussi</em>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
