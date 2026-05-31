"use client";

import { motion } from "framer-motion";
import { Package, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { formatPrice, formatDate, cn } from "@/utils";

const MOCK_ORDERS = [
  {
    id: "LUM-2025-4821",
    date: new Date("2025-05-07"),
    products: ["Collier Étoile Dorée"],
    total: 1290,
    status: "DELIVERED",
    tracking: "FR123456789",
  },
  {
    id: "LUM-2025-4756",
    date: new Date("2025-04-22"),
    products: ["Parfum Signature No. 7"],
    total: 380,
    status: "DELIVERED",
    tracking: "FR987654321",
  },
  {
    id: "LUM-2025-4612",
    date: new Date("2025-04-08"),
    products: ["Écharpe Cachemire Alpin", "Bracelet Or Blanc Pavé"],
    total: 1230,
    status: "DELIVERED",
    tracking: "FR456789123",
  },
  {
    id: "LUM-2025-4490",
    date: new Date("2025-03-15"),
    products: ["Bague Saphir Royal"],
    total: 2150,
    status: "DELIVERED",
    tracking: "FR321654987",
  },
];

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  DELIVERED: {
    label: "Livré",
    className: "bg-emerald-500/10 text-emerald-400",
  },
  SHIPPED: { label: "En transit", className: "bg-blue-500/10 text-blue-400" },
  PROCESSING: {
    label: "En préparation",
    className: "bg-[var(--gold)]/10 text-[var(--gold)]",
  },
  PENDING: { label: "En attente", className: "bg-muted text-muted-foreground" },
  CANCELLED: { label: "Annulé", className: "bg-red-500/10 text-red-400" },
};

export default function CommandesPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MOCK_ORDERS.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.products.some((p) => p.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light mb-1">Mes commandes</h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_ORDERS.length} commandes
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une commande..."
          className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm outline-none focus:border-[var(--gold)]"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <button
              className="w-full flex items-center gap-4 p-5 hover:bg-secondary/30 transition-colors text-left"
              onClick={() =>
                setExpanded(expanded === order.id ? null : order.id)
              }
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm text-[var(--gold)]">
                    #{order.id}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] px-2.5 py-0.5 rounded-full font-medium",
                      STATUS_MAP[order.status].className,
                    )}
                  >
                    {STATUS_MAP[order.status].label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {order.products.join(", ")}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono font-medium">
                  {formatPrice(order.total)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.date)}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  expanded === order.id && "rotate-90",
                )}
              />
            </button>

            {/* Expanded */}
            {expanded === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border px-5 py-4 bg-secondary/20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Suivi
                    </p>
                    <p className="font-mono text-xs">{order.tracking}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Articles
                    </p>
                    {order.products.map((p) => (
                      <p key={p} className="text-xs">
                        {p}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Total
                    </p>
                    <p className="font-mono">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors">
                    Voir le détail
                  </button>
                  <button className="px-4 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors">
                    Suivre la livraison
                  </button>
                  {order.status === "DELIVERED" && (
                    <button className="px-4 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors">
                      Retourner un article
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
