"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Check,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { formatPrice, generateOrderNumber } from "@/utils";
import { cn } from "@/utils";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const shippingSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro invalide"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(4, "Code postal requis"),
  country: z.string().min(2, "Pays requis"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Numéro invalide").max(19),
  cardHolder: z.string().min(3, "Nom requis"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format MM/AA"),
  cvv: z.string().min(3, "CVV invalide").max(4),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

// ─── Step Components ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Livraison", Icon: MapPin },
  { id: 2, label: "Paiement", Icon: CreditCard },
  { id: 3, label: "Confirmation", Icon: Package },
];

function StepsBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                current > step.id
                  ? "bg-emerald-500 text-white"
                  : current === step.id
                    ? "bg-[var(--gold)] text-background"
                    : "bg-secondary border border-border text-muted-foreground",
              )}
            >
              {current > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={cn(
                "text-sm hidden sm:block",
                current === step.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "w-12 sm:w-20 h-px mx-3 transition-colors",
                current > step.id + 1 ? "bg-emerald-500" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FormInput({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        {...props}
        className={cn(
          "bg-secondary border rounded-xl px-4 py-3 text-sm outline-none transition-colors",
          error
            ? "border-destructive"
            : "border-border focus:border-[var(--gold)]",
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutClient() {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const discount = useCartStore((s) => s.getDiscount());
  const shipping = useCartStore((s) => s.getShipping());
  const total = useCartStore((s) => s.getTotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const shippingForm = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });
  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
  });

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = async (data: PaymentData) => {
    setPayLoading(true);
    // Simulate Stripe payment
    await new Promise((r) => setTimeout(r, 2000));
    const num = generateOrderNumber();
    setOrderNumber(num);
    clearCart();
    setStep(3);
    setPayLoading(false);
    toast.success("Paiement accepté ! 🎉");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Order summary sidebar
  const OrderSummary = () => (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 sticky top-24">
      <h3 className="text-sm font-semibold uppercase tracking-wider">
        Votre commande
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              {item.product.images[0] && (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              )}
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--gold)] text-background text-[9px] flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {item.product.name}
              </p>
              {item.variant && (
                <p className="text-[10px] text-muted-foreground">
                  {item.variant.value}
                </p>
              )}
            </div>
            <span className="font-mono text-xs">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Sous-total</span>
          <span className="font-mono">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-400">
            <span>Réduction</span>
            <span className="font-mono">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Livraison</span>
          <span
            className={cn("font-mono", shipping === 0 && "text-emerald-400")}
          >
            {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t border-border">
          <span>Total TTC</span>
          <span className="font-mono text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container px-4 py-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/panier"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Panier
        </Link>
        <div className="flex-1 h-px bg-border" />
        <span className="font-serif text-xl font-light">Checkout</span>
      </div>

      <StepsBar current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <form
                  onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--gold)]" />{" "}
                      Informations personnelles
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Prénom"
                        placeholder="Sophie"
                        {...shippingForm.register("firstName")}
                        error={shippingForm.formState.errors.firstName?.message}
                      />
                      <FormInput
                        label="Nom"
                        placeholder="Martin"
                        {...shippingForm.register("lastName")}
                        error={shippingForm.formState.errors.lastName?.message}
                      />
                      <FormInput
                        label="Email"
                        type="email"
                        placeholder="vous@example.com"
                        className="col-span-2"
                        {...shippingForm.register("email")}
                        error={shippingForm.formState.errors.email?.message}
                      />
                      <FormInput
                        label="Téléphone"
                        type="tel"
                        placeholder="+33 6 00 00 00 00"
                        className="col-span-2"
                        {...shippingForm.register("phone")}
                        error={shippingForm.formState.errors.phone?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--gold)]" /> Adresse
                      de livraison
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Adresse"
                        placeholder="12 rue de la Paix"
                        className="col-span-2"
                        {...shippingForm.register("address")}
                        error={shippingForm.formState.errors.address?.message}
                      />
                      <FormInput
                        label="Ville"
                        placeholder="Paris"
                        {...shippingForm.register("city")}
                        error={shippingForm.formState.errors.city?.message}
                      />
                      <FormInput
                        label="Code postal"
                        placeholder="75001"
                        {...shippingForm.register("postalCode")}
                        error={
                          shippingForm.formState.errors.postalCode?.message
                        }
                      />
                      <div className="col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Pays
                        </label>
                        <select
                          {...shippingForm.register("country")}
                          defaultValue="France"
                          className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
                        >
                          <option>France</option>
                          <option>Belgique</option>
                          <option>Suisse</option>
                          <option>Luxembourg</option>
                          <option>Monaco</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-[var(--gold)] text-background rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Continuer vers le paiement{" "}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Shipping summary */}
                {shippingData && (
                  <div className="mb-6 p-4 bg-secondary/50 border border-border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Livraison à
                      </p>
                      <p className="text-sm font-medium">
                        {shippingData.firstName} {shippingData.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shippingData.address}, {shippingData.postalCode}{" "}
                        {shippingData.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[var(--gold)] hover:underline"
                    >
                      Modifier
                    </button>
                  </div>
                )}

                <form
                  onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[var(--gold)]" />{" "}
                    Informations de paiement
                  </h2>

                  {/* Card visual */}
                  <div className="relative w-full aspect-[1.75] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2018] to-[#1a130a] border border-[var(--gold)]/20 p-6 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,169,110,0.12),transparent_60%)]" />
                    <div className="relative flex justify-between items-start">
                      <div className="w-10 h-7 rounded-md bg-[var(--gold)] opacity-80" />
                      <span className="font-mono text-[var(--gold)] text-lg tracking-widest">
                        VISA
                      </span>
                    </div>
                    <div className="relative space-y-1">
                      <p className="font-mono text-white/60 tracking-[0.2em] text-base">
                        •••• •••• •••• 4242
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            Titulaire
                          </p>
                          <p className="text-sm text-white/70 font-medium uppercase tracking-wide">
                            {shippingData?.firstName} {shippingData?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            Expire
                          </p>
                          <p className="text-sm text-white/70 font-mono">
                            MM/AA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Numéro de carte"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="col-span-2"
                      {...paymentForm.register("cardNumber")}
                      error={paymentForm.formState.errors.cardNumber?.message}
                      onChange={(e) => {
                        const v = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        const formatted = v.match(/.{1,4}/g)?.join(" ") ?? v;
                        paymentForm.setValue("cardNumber", formatted);
                      }}
                    />
                    <FormInput
                      label="Nom sur la carte"
                      placeholder="SOPHIE MARTIN"
                      className="col-span-2"
                      {...paymentForm.register("cardHolder")}
                      error={paymentForm.formState.errors.cardHolder?.message}
                    />
                    <FormInput
                      label="Expiration"
                      placeholder="MM/AA"
                      maxLength={5}
                      {...paymentForm.register("expiry")}
                      error={paymentForm.formState.errors.expiry?.message}
                    />
                    <FormInput
                      label="CVV"
                      placeholder="•••"
                      type="password"
                      maxLength={4}
                      {...paymentForm.register("cvv")}
                      error={paymentForm.formState.errors.cvv?.message}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Paiement 100% sécurisé via Stripe · Vos données sont
                    chiffrées
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 border border-border rounded-xl text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Retour
                    </button>
                    <motion.button
                      type="submit"
                      disabled={payLoading}
                      className="flex-1 bg-[var(--gold)] text-background rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                      whileHover={payLoading ? {} : { scale: 1.01 }}
                      whileTap={payLoading ? {} : { scale: 0.99 }}
                    >
                      {payLoading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Traitement en cours…
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Payer {formatPrice(total)}
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="font-serif text-4xl font-light mb-3">
                    Merci, {shippingData?.firstName} !
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    Votre commande{" "}
                    <span className="font-mono text-[var(--gold)]">
                      #{orderNumber}
                    </span>{" "}
                    a été confirmée.
                  </p>
                  <p className="text-sm text-muted-foreground mb-10">
                    Un email de confirmation a été envoyé à{" "}
                    <strong>{shippingData?.email}</strong>
                  </p>

                  <div className="bg-card border border-border rounded-2xl p-6 text-left max-w-sm mx-auto mb-8 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Récapitulatif
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Commande</span>
                      <span className="font-mono text-[var(--gold)]">
                        #{orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total payé</span>
                      <span className="font-mono font-semibold">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Livraison estimée
                      </span>
                      <span className="text-emerald-400">3–5 jours ouvrés</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard/commandes">
                      <motion.div
                        className="px-8 py-3 bg-[var(--gold)] text-background rounded-full text-sm font-semibold"
                        whileHover={{ scale: 1.03 }}
                      >
                        Suivre ma commande
                      </motion.div>
                    </Link>
                    <Link href="/">
                      <motion.div
                        className="px-8 py-3 border border-border rounded-full text-sm hover:bg-secondary transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        Retour à l'accueil
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary sidebar - hide on step 3 */}
        {step !== 3 && (
          <div className="lg:col-span-1 hidden lg:block">
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
