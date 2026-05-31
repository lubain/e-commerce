"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().max(200).optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Sophie Martin",
      email: "sophie@example.com",
      phone: "+33 6 12 34 56 78",
    },
  });

  const onSubmit = async (_data: ProfileData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light mb-8">Mon profil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 bg-card border border-border rounded-2xl">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[var(--gold)] flex items-center justify-center text-background text-2xl font-bold">
            SM
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-background transition-all">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium text-lg">Sophie Martin</p>
          <p className="text-sm text-muted-foreground">
            Membre Premium · Depuis janvier 2022
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
              Niveau Or
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Achat vérifié
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Nom complet",
              field: "name",
              placeholder: "Sophie Martin",
            },
            {
              label: "Email",
              field: "email",
              placeholder: "sophie@example.com",
              type: "email",
            },
            {
              label: "Téléphone",
              field: "phone",
              placeholder: "+33 6 00 00 00 00",
            },
          ].map(({ label, field, placeholder, type = "text" }) => (
            <div
              key={field}
              className={cn(
                "flex flex-col gap-1.5",
                field === "email" && "col-span-2",
              )}
            >
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(field as keyof ProfileData)}
                className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
          ))}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Bio (optionnel)
            </label>
            <textarea
              {...register("bio")}
              placeholder="Dites-en plus sur vous..."
              rows={3}
              className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors resize-none"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-background rounded-xl text-sm font-semibold disabled:opacity-70"
          whileHover={saving ? {} : { scale: 1.02 }}
          whileTap={saving ? {} : { scale: 0.98 }}
        >
          {saving ? (
            <motion.div
              className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </motion.button>
      </form>
    </div>
  );
}
