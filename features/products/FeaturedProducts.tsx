"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Truck,
  RefreshCw,
  Award,
  Star,
  Quote,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data";

// ─── Featured Products ────────────────────────────────────────────────────────

export function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section ref={ref} className="py-24 container px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-3">
            Sélection Premium
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">
            Produits <em className="italic">Populaires</em>
          </h2>
        </div>
        <Link href="/boutique">
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            whileHover={{ x: 4 }}
          >
            Voir toute la boutique
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  "cat-1": "rgba(201,169,110,0.15)",
  "cat-2": "rgba(130,162,224,0.15)",
  "cat-3": "rgba(82,196,122,0.15)",
  "cat-4": "rgba(224,130,82,0.15)",
};

const CAT_ICONS: Record<string, string> = {
  "cat-1": "💍",
  "cat-2": "⌚",
  "cat-3": "👜",
  "cat-4": "👗",
};

export function CategoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-3">
            Collections
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">
            Explorez nos <em className="italic">Univers</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/boutique?category=${cat.slug}`}>
                <motion.div
                  className="group relative aspect-square rounded-2xl border border-border bg-card flex flex-col items-center justify-center gap-3 overflow-hidden cursor-pointer"
                  whileHover={{ borderColor: "rgba(201,169,110,0.4)", y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at center, ${CAT_COLORS[cat.id]} 0%, transparent 70%)`,
                    }}
                  />
                  <span className="text-4xl relative z-10">
                    {CAT_ICONS[cat.id]}
                  </span>
                  <div className="text-center relative z-10">
                    <p className="font-medium text-sm mb-1">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat._count?.products} pièces
                    </p>
                  </div>
                  <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-[var(--gold)] flex items-center gap-1">
                      Explorer <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────

export function PromoBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="container px-4 py-20"
    >
      <div className="relative rounded-3xl overflow-hidden border border-[var(--gold)]/20 bg-gradient-to-br from-[#1a1508] via-[#221b0a] to-[#1a1508] p-12 md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,169,110,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-4">
              ✦ Offre Limitée — Été 2025
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4 text-white">
              Soldes Exclusives
            </h2>
            <p className="text-white/60 text-sm">
              Sur toute la collection printemps-été.
              <br />
              Jusqu&apos;au 30 juin 2025.
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <p className="font-serif text-8xl font-light text-[var(--gold)] leading-none mb-4">
              -30%
            </p>
            <div className="font-mono text-sm text-white/50 border border-dashed border-[var(--gold)]/30 rounded-lg px-6 py-2 mb-6">
              Code : LUMIÈRE30
            </div>
            <Link href="/boutique?sale=true">
              <motion.div
                className="px-8 py-3.5 bg-[var(--gold)] text-background rounded-full text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(201,169,110,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Profiter de l&apos;offre <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Sophie Martin",
    role: "Cliente fidèle depuis 3 ans",
    text: "Une expérience d'achat exceptionnelle. La qualité des produits dépasse mes attentes et le service client est irréprochable.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Laurent Dubois",
    role: "Acheteur premium",
    text: "Le packaging est sublime et la livraison ultra-rapide. Chaque détail témoigne d'un savoir-faire artisanal remarquable.",
    rating: 5,
    initials: "LD",
  },
  {
    name: "Amélie Chen",
    role: "Designer, Paris",
    text: "LUMIÈRE a transformé ma façon de faire du shopping. La curation des produits est tout simplement extraordinaire.",
    rating: 5,
    initials: "AC",
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-3">
            Avis Clients
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">
            Ils nous <em className="italic">font confiance</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-7"
            >
              <Quote className="w-8 h-8 text-[var(--gold)]/30 mb-4" />
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-background text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────

const BADGES = [
  { Icon: Truck, title: "Livraison Offerte", desc: "Dès 300€ d'achat" },
  { Icon: RefreshCw, title: "Retour 30 jours", desc: "Remboursement intégral" },
  { Icon: Shield, title: "Paiement Sécurisé", desc: "SSL 256-bit · Stripe" },
  { Icon: Award, title: "Authenticité Garantie", desc: "Certificat inclus" },
];

export function TrustBadges() {
  return (
    <div className="border-y border-border/50 py-8 bg-secondary/20">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

export function RecentlyViewed() {
  const recent = PRODUCTS.slice(4, 8);
  return (
    <section className="py-20 container px-4">
      <div className="mb-10">
        <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-3">
          Récemment consultés
        </p>
        <h2 className="font-serif text-3xl font-light">
          Continuez votre <em className="italic">exploration</em>
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {recent.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
