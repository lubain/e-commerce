"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Shield, Trash2, Download, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-colors",
        checked ? "bg-[var(--gold)]" : "bg-secondary border border-border",
      )}
    >
      <motion.div
        className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm"
        animate={{ left: checked ? "20px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function SettingRow({
  Icon,
  title,
  description,
  children,
}: {
  Icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border/50 hover:border-border transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: false,
    darkMode: true,
    twoFA: false,
    newsletter: true,
    language: "fr",
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
    toast.success("Paramètre mis à jour");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light mb-8">Paramètres</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Notifications
          </h2>
          <div className="space-y-2">
            <SettingRow
              Icon={Bell}
              title="Emails de commandes"
              description="Alertes expédition et livraison"
            >
              <ToggleSwitch
                checked={settings.emailNotifs}
                onChange={() => toggle("emailNotifs")}
              />
            </SettingRow>
            <SettingRow
              Icon={Bell}
              title="Notifications push"
              description="Alertes en temps réel"
            >
              <ToggleSwitch
                checked={settings.pushNotifs}
                onChange={() => toggle("pushNotifs")}
              />
            </SettingRow>
            <SettingRow
              Icon={Bell}
              title="Newsletter"
              description="Nouvelles collections et offres"
            >
              <ToggleSwitch
                checked={settings.newsletter}
                onChange={() => toggle("newsletter")}
              />
            </SettingRow>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Apparence
          </h2>
          <div className="space-y-2">
            <SettingRow
              Icon={Moon}
              title="Mode sombre"
              description="Thème sombre de l'interface"
            >
              <ToggleSwitch
                checked={settings.darkMode}
                onChange={() => toggle("darkMode")}
              />
            </SettingRow>
            <SettingRow
              Icon={Globe}
              title="Langue"
              description="Langue de l'interface"
            >
              <select
                value={settings.language}
                onChange={(e) => {
                  setSettings((p) => ({ ...p, language: e.target.value }));
                  toast.success("Langue mise à jour");
                }}
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </SettingRow>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Sécurité
          </h2>
          <div className="space-y-2">
            <SettingRow
              Icon={Shield}
              title="Authentification 2FA"
              description="Sécurité renforcée par code SMS"
            >
              <ToggleSwitch
                checked={settings.twoFA}
                onChange={() => toggle("twoFA")}
              />
            </SettingRow>
            <div className="p-4 bg-secondary/50 rounded-xl border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Changer le mot de passe
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dernière modification : il y a 3 mois
                    </p>
                  </div>
                </div>
                <motion.button
                  className="px-4 py-2 border border-border rounded-xl text-xs hover:bg-secondary transition-colors"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toast.info("Envoi du lien de modification…")}
                >
                  Modifier
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Données personnelles
          </h2>
          <div className="space-y-2">
            <motion.button
              className="w-full flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border/50 hover:border-border text-left transition-colors"
              whileTap={{ scale: 0.99 }}
              onClick={() => toast.success("Export de vos données en cours…")}
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Download className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Exporter mes données</p>
                <p className="text-xs text-muted-foreground">
                  Télécharger toutes vos données personnelles (RGPD)
                </p>
              </div>
            </motion.button>

            <motion.button
              className="w-full flex items-center gap-3 p-4 bg-red-500/5 rounded-xl border border-red-500/20 hover:border-red-500/40 text-left transition-colors"
              whileTap={{ scale: 0.99 }}
              onClick={() =>
                toast.error(
                  "Cette action est irréversible. Contactez le support.",
                )
              }
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">
                  Supprimer mon compte
                </p>
                <p className="text-xs text-muted-foreground">
                  Action irréversible — toutes vos données seront effacées
                </p>
              </div>
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}
