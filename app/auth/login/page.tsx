import { Metadata } from "next";
import { Suspense } from "react";
import { AuthClient } from "@/features/auth/AuthClient";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte LUMIÈRE",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthClient defaultTab="login" />
    </Suspense>
  );
}
