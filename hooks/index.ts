import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import type { Product, ProductFilters } from "@/types";
import { PRODUCTS } from "@/lib/data";

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      // In production, fetch from API:
      // const params = new URLSearchParams()
      // if (filters?.search) params.set('search', filters.search)
      // ...
      // const res = await fetch(`/api/products?${params}`)
      // return res.json()

      // Demo: filter in memory
      let results = [...PRODUCTS];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.name.toLowerCase().includes(q),
        );
      }
      if (filters?.categoryId) {
        results = results.filter((p) => p.category.slug === filters.categoryId);
      }
      return {
        data: results,
        total: results.length,
        page: 1,
        limit: 100,
        totalPages: 1,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = PRODUCTS.find((p) => p.slug === slug);
      if (!product) throw new Error("Product not found");
      return product;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => PRODUCTS.filter((p) => p.isFeatured),
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: unknown) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Commande créée avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la commande");
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      return res.json();
    },
  });
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async ({
      amount,
      orderId,
    }: {
      amount: number;
      orderId?: string;
    }) => {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      });
      if (!res.ok) throw new Error("Payment intent creation failed");
      return res.json();
    },
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      return PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      ).slice(0, 8);
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

const STORAGE_KEY = "lumiere_recently_viewed";

export function useRecentlyViewed() {
  const addToRecentlyViewed = useCallback((productId: string) => {
    try {
      const existing: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      );
      const updated = [
        productId,
        ...existing.filter((id) => id !== productId),
      ].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const getRecentlyViewed = useCallback((): Product[] => {
    try {
      const ids: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      );
      return ids
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean) as Product[];
    } catch {
      return [];
    }
  }, []);

  return { addToRecentlyViewed, getRecentlyViewed };
}
