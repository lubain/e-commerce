"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/utils";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Nom requis (2 caractères minimum)"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "6 caractères minimum"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormInput({
  label,
  error,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={isPassword && show ? "text" : type}
          className={cn(
            "w-full bg-secondary border rounded-xl px-4 py-3 text-sm outline-none transition-colors",
            isPassword && "pr-11",
            error
              ? "border-destructive focus:border-destructive"
              : "border-border focus:border-[var(--gold)]",
          )}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <motion.div
      className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Google Button ─────────────────────────────────────────────────────────────

function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Erreur lors de la connexion Google");
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 shadow-sm"
      whileHover={loading ? {} : { scale: 1.01 }}
      whileTap={loading ? {} : { scale: 0.99 }}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        // Google SVG logo
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {loading ? "Connexion en cours…" : "Continuer avec Google"}
    </motion.button>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Create account via API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Erreur lors de la création du compte");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(
          "Compte créé, mais connexion échouée. Connectez-vous manuellement.",
        );
        router.push("/auth/login");
      } else {
        toast.success("Bienvenue chez LUMIÈRE ! 🎉");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nom complet"
        placeholder="Sophie Martin"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />
      <FormInput
        label="Email"
        type="email"
        placeholder="vous@example.com"
        {...form.register("email")}
        error={form.formState.errors.email?.message}
      />
      <FormInput
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        {...form.register("password")}
        error={form.formState.errors.password?.message}
      />
      <FormInput
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        {...form.register("confirmPassword")}
        error={form.formState.errors.confirmPassword?.message}
      />

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--gold)] text-background rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.99 }}
      >
        {loading ? <Spinner /> : null}
        {loading ? "Création du compte…" : "Créer mon compte"}
      </motion.button>

      <p className="text-xs text-center text-muted-foreground">
        En créant un compte, vous acceptez nos{" "}
        <Link href="/cgv" className="text-[var(--gold)] hover:underline">
          CGV
        </Link>{" "}
        et notre{" "}
        <Link
          href="/confidentialite"
          className="text-[var(--gold)] hover:underline"
        >
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}

// ─── Login Form ────────────────────────────────────────────────────────────────

function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const form = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setAuthError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setAuthError("Email ou mot de passe incorrect.");
      return;
    }

    toast.success("Connexion réussie ! Bienvenue.");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {authError}
        </div>
      )}

      <FormInput
        label="Email"
        type="email"
        placeholder="vous@example.com"
        {...form.register("email")}
        error={form.formState.errors.email?.message}
      />
      <FormInput
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        {...form.register("password")}
        error={form.formState.errors.password?.message}
      />

      <div className="text-right">
        <Link
          href="/auth/forgot-password"
          className="text-xs text-[var(--gold)] hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--gold)] text-background rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        whileHover={loading ? {} : { scale: 1.01 }}
        whileTap={loading ? {} : { scale: 0.99 }}
      >
        {loading ? <Spinner /> : null}
        {loading ? "Connexion…" : "Se connecter"}
      </motion.button>
    </form>
  );
}

// ─── Main AuthClient ───────────────────────────────────────────────────────────

interface AuthClientProps {
  defaultTab?: "login" | "register";
}

export function AuthClient({ defaultTab = "login" }: AuthClientProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#1a1508] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(201,169,110,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="font-serif text-3xl font-light tracking-[0.15em] text-[var(--gold)]">
              LUMIÈRE
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {tab === "login"
                ? "L'excellence vous attend"
                : "Rejoignez la maison LUMIÈRE"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <div className="mb-5">
            <GoogleButton callbackUrl={callbackUrl} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou par email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm callbackUrl={callbackUrl} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm callbackUrl={callbackUrl} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
