"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { formatPrice, debounce } from "@/utils";
import type { Product, ProductSortOption } from "@/types";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "popular", label: "Plus populaires" },
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Meilleures notes" },
];

interface ShopClientProps {
  searchParams: { [key: string]: string | undefined };
}

export function ShopClient({ searchParams }: ShopClientProps) {
  const [search, setSearch] = useState(searchParams.search ?? "");
  const [selectedCats, setSelectedCats] = useState<string[]>(
    searchParams.category ? [searchParams.category] : [],
  );
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSortOption>(
    (searchParams.sort as ProductSortOption) ?? "popular",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result: Product[] = [...PRODUCTS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }

    // Categories
    if (selectedCats.length > 0) {
      result = result.filter((p) => selectedCats.includes(p.category.slug));
    }

    // Price
    result = result.filter((p) => p.price <= maxPrice);

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sale only
    if (searchParams.sale === "true") {
      result = result.filter(
        (p) => p.compareAtPrice && p.compareAtPrice > p.price,
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [
    search,
    selectedCats,
    maxPrice,
    minRating,
    inStockOnly,
    sort,
    searchParams.sale,
  ]);

  const toggleCat = (slug: string) =>
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );

  const resetFilters = () => {
    setSearch("");
    setSelectedCats([]);
    setMinRating(0);
    setMaxPrice(5000);
    setInStockOnly(false);
    setSort("popular");
  };

  const hasActiveFilters =
    selectedCats.length > 0 || minRating > 0 || maxPrice < 5000 || inStockOnly;

  return (
    <div className="container px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-2">
          {searchParams.sale === "true" ? "Soldes" : "Toute la collection"}
        </p>
        <h1 className="font-serif text-4xl font-light">
          {searchParams.category
            ? (CATEGORIES.find((c) => c.slug === searchParams.category)?.name ??
              "Boutique")
            : "Boutique"}
        </h1>
      </div>

      {/* Search + Controls bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm outline-none focus:border-[var(--gold)] transition-colors"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters toggle (mobile) */}
        <button
          className="md:hidden flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres{" "}
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
          )}
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSortOption)}
            className="appearance-none pl-4 pr-10 py-3 bg-secondary border border-border rounded-xl text-sm outline-none focus:border-[var(--gold)] transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* View mode */}
        <div className="hidden md:flex items-center gap-1 bg-secondary border border-border rounded-xl p-1">
          <button
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-background text-foreground" : "text-muted-foreground"}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-background text-foreground" : "text-muted-foreground"}`}
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`
          w-64 flex-shrink-0
          ${filtersOpen ? "block" : "hidden"} md:block
          fixed md:relative inset-0 md:inset-auto z-40 md:z-auto
          bg-background md:bg-transparent p-4 md:p-0
          overflow-y-auto
        `}
        >
          {/* Mobile close */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h3 className="font-medium">Filtres</h3>
            <button onClick={() => setFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-7 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Filtres
              </h3>
              {hasActiveFilters && (
                <button
                  className="text-xs text-[var(--gold)] hover:underline"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Catégorie
              </p>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                        selectedCats.includes(cat.slug)
                          ? "bg-[var(--gold)] border-[var(--gold)]"
                          : "border-border group-hover:border-[var(--gold)]/50"
                      }`}
                      onClick={() => toggleCat(cat.slug)}
                    >
                      {selectedCats.includes(cat.slug) && (
                        <span className="text-background text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {cat.name}
                      <span className="ml-1 text-muted-foreground/50 text-xs">
                        ({cat._count?.products})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Prix max :{" "}
                <span className="text-[var(--gold)]">
                  {formatPrice(maxPrice)}
                </span>
              </p>
              <input
                type="range"
                min={0}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--gold)]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>€0</span>
                <span>€5 000</span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Note minimale
              </p>
              <div className="space-y-1.5">
                {[0, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      minRating === r
                        ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "hover:bg-secondary text-muted-foreground"
                    }`}
                    onClick={() => setMinRating(r)}
                  >
                    {r === 0 ? "Toutes" : `${"★".repeat(r)} ${r}+ étoiles`}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-9 h-5 rounded-full transition-colors ${inStockOnly ? "bg-[var(--gold)]" : "bg-secondary"}`}
                onClick={() => setInStockOnly(!inStockOnly)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${inStockOnly ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                En stock uniquement
              </span>
            </label>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">
                {filtered.length}
              </span>{" "}
              produit{filtered.length !== 1 ? "s" : ""} trouvé
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-medium mb-2">Aucun résultat</p>
              <p className="text-muted-foreground text-sm mb-6">
                Essayez de modifier vos filtres
              </p>
              <button
                className="px-6 py-2.5 bg-[var(--gold)] text-background rounded-full text-sm font-semibold"
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div
                className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
              >
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
