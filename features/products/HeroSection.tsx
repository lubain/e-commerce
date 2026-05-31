"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

const MARQUEE_ITEMS = [
  "Haute Joaillerie",
  "Artisan Français",
  "Or 18 Carats",
  "Édition Limitée",
  "Livraison Offerte",
  "Retour 30 jours",
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#1a150a] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,169,110,0.08),transparent)] pointer-events-none" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative flex-1 container mx-auto px-4 flex items-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full pt-24 pb-12">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 mb-8"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-xs font-medium tracking-[0.12em] text-[var(--gold)] uppercase">
                Nouvelle Collection 2025
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6"
            >
              L&apos;Art du <em className="italic text-[var(--gold)]">Luxe</em>
              <br />
              Moderne <em className="italic">Redéfini.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed max-w-md mb-10"
            >
              Des créations intemporelles qui allient savoir-faire artisanal et
              design contemporain. Chaque pièce raconte une histoire
              d&apos;élégance et de précision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link href="/boutique">
                <motion.div
                  className="flex items-center gap-2 px-7 py-3.5 bg-[var(--gold)] text-background rounded-full text-sm font-semibold tracking-wide uppercase cursor-pointer"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 12px 40px rgba(201,169,110,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explorer la collection <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
              <motion.button
                className="flex items-center gap-2 px-7 py-3.5 border border-border rounded-full text-sm font-medium tracking-wide uppercase hover:border-foreground/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current" />
                </div>
                Notre histoire
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
            >
              {[
                { value: "48k+", label: "Clients satisfaits" },
                { value: "4.9★", label: "Note moyenne" },
                { value: "12", label: "Collections" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl font-light text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="absolute w-80 h-80 rounded-full bg-[var(--gold)]/10 blur-[80px] pointer-events-none" />

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-72 h-96 bg-gradient-to-br from-[#2a2018] to-[#1a130a] rounded-3xl border border-[var(--gold)]/20 flex flex-col items-center justify-center gap-4 shadow-[0_40px_120px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(201,169,110,0.1)]"
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.12)_0%,transparent_70%)]" />
              </div>
              <span className="text-8xl relative z-10 select-none">✦</span>
              <div className="text-center relative z-10">
                <p className="font-serif text-2xl font-light text-[var(--gold)] tracking-[0.1em] mb-1">
                  Édition Signature
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  € 1 290
                </p>
              </div>
              <motion.button
                className="relative z-10 px-6 py-2.5 bg-[var(--gold)]/15 border border-[var(--gold)]/30 rounded-full text-sm text-[var(--gold)] font-medium"
                whileHover={{ scale: 1.04 }}
              >
                Voir le produit
              </motion.button>
            </motion.div>

            {/* Floating chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg"
            >
              <p className="text-xs text-muted-foreground mb-0.5">Note</p>
              <p className="text-sm font-semibold">⭐ 4.9 / 5</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg"
            >
              <p className="text-xs text-muted-foreground mb-0.5">Livraison</p>
              <p className="text-sm font-semibold text-emerald-400">
                Gratuite ✓
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="border-t border-border/50 py-4 overflow-hidden bg-background/50 backdrop-blur-sm">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="text-xs tracking-[0.15em] text-muted-foreground uppercase flex items-center gap-12"
              >
                {item}
                <span className="text-[var(--gold)]">✦</span>
              </span>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
