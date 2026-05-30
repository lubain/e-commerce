import { Metadata } from "next";
import { CartClient } from "@/features/cart/CartClient";

export const metadata: Metadata = {
  title: "Mon Panier",
  description: "Votre panier LUMIÈRE",
};

export default function CartPage() {
  return <CartClient />;
}
