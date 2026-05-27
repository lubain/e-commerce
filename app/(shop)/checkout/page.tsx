import { Metadata } from "next";
import { CheckoutClient } from "@/features/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalisez votre commande LUMIÈRE",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
