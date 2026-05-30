import { Metadata } from "next";
import { Suspense } from "react";
import { AuthClient } from "@/features/auth/AuthClient";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoignez la maison LUMIÈRE",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthClient defaultTab="register" />
    </Suspense>
  );
}
