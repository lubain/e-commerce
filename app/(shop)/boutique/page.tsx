import { Metadata } from "next";
import { ShopClient } from "@/features/products/ShopClient";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez toute la collection LUMIÈRE : bijoux, montres, maroquinerie et mode de luxe.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <ShopClient searchParams={params} />;
}
