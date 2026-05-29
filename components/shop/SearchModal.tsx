"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { formatPrice } from "@/utils";
import type { Product } from "@/types";

const TRENDING = [
  "Collier or",
  "Montre automatique",
  "Sac cuir",
  "Bague diamant",
];
const RECENT_SEARCHES_KEY = "lumiere_recent_searches";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch {}
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 6);
    setResults(filtered);
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            {/* Input */}
            <div className="container px-4 py-4">
              <div className="flex items-center gap-3 max-w-3xl mx-auto">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher bijoux, montres, maroquinerie..."
                  className="flex-1 bg-transparent text-base outline-none text-foreground placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(query);
                    if (e.key === "Escape") onClose();
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs"
                >
                  ESC
                </button>
              </div>
            </div>

            {/* Results / Suggestions */}
            <div className="container px-4 pb-6 max-w-3xl mx-auto">
              {!query ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Récents
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            className="px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                            onClick={() => setQuery(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Tendances
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((t) => (
                        <button
                          key={t}
                          className="px-3 py-1.5 rounded-full bg-[var(--gold)]/10 text-sm text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors"
                          onClick={() => setQuery(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucun résultat pour &ldquo;{query}&rdquo;amp;quot;{query}
                  &quot;{query}&quot;amp;quot;
                </p>
              ) : (
                <div className="space-y-1">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produit/${product.slug}`}
                      onClick={() => {
                        handleSearch(query);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-colors group">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category.name}
                          </p>
                        </div>
                        <span className="font-mono text-sm text-[var(--gold)]">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/boutique?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 pt-3 text-sm text-[var(--gold)] hover:underline"
                  >
                    Voir tous les résultats pour &ldquo;{query}&rdquo;amp;quot;
                    {query}&quot;{query}&quot;amp;quot;
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
