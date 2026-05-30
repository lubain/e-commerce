import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/data";
import type { ProductFilters } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: ProductFilters = {
    search: searchParams.get("search") ?? undefined,
    categoryId: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    inStock: searchParams.get("inStock") === "true",
    sort: (searchParams.get("sort") as ProductFilters["sort"]) ?? "popular",
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 12),
  };

  let results = [...PRODUCTS];

  // Filter by search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    );
  }

  // Filter by category slug
  if (filters.categoryId) {
    results = results.filter((p) => p.category.slug === filters.categoryId);
  }

  // Filter by price
  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  // Filter by rating
  if (filters.minRating) {
    results = results.filter((p) => p.rating >= filters.minRating!);
  }

  // Filter in-stock
  if (filters.inStock) {
    results = results.filter((p) => p.stock > 0);
  }

  // Sort
  switch (filters.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    default:
      results.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const total = results.length;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const totalPages = Math.ceil(total / limit);
  const data = results.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
}
