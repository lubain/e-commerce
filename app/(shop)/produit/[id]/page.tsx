import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { ProductDetailClient } from "@/features/products/ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.slug === id);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.slug === id);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id,
  ).slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
