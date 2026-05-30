import { Metadata } from "next";
import { HeroSection } from "@/features/products/HeroSection";
import {
  FeaturedProducts,
  CategoriesSection,
  PromoBanner,
  TestimonialsSection,
  TrustBadges,
  RecentlyViewed,
} from "@/features/products/FeaturedProducts";

export const metadata: Metadata = {
  title: "LUMIÈRE — Luxe Contemporain",
  description:
    "Maison de création française. Des pièces intemporelles alliant savoir-faire artisanal et design contemporain.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <FeaturedProducts />
      <CategoriesSection />
      <PromoBanner />
      <TestimonialsSection />
      <RecentlyViewed />
    </>
  );
}
