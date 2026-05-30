"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Erreur de configuration du serveur.",
  AccessDenied:
    "Accès refusé. Vous n'avez pas la permission d'accéder à cette ressource.",
  Verification: "Le lien de vérification a expiré ou a déjà été utilisé.",
  OAuthSignin: "Erreur lors de la connexion avec Google. Réessayez.",
  OAuthCallback: "Erreur lors du callback OAuth. Réessayez.",
  OAuthAccountNotLinked: "Cet email est déjà associé à un autre compte.",
  CredentialsSignin: "Email ou mot de passe incorrect.",
  Default: "Une erreur inattendue s'est produite.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(201,169,110,0.06),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-border rounded-3xl p-10 w-full max-w-md text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="font-serif text-2xl font-light mb-3">
          Erreur d&apos;authentification
        </h1>
        <p className="text-muted-foreground text-sm mb-8">{message}</p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <motion.div
              className="w-full py-3 bg-[var(--gold)] text-background rounded-xl text-sm font-semibold cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Réessayer la connexion
            </motion.div>
          </Link>
          <Link href="/">
            <div className="w-full py-3 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              Retour à l&apos;accueil
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ErrorContent />
    </Suspense>
  );
}
