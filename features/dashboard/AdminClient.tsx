"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, REVENUE_DATA } from "@/lib/data";
import { formatPrice, formatDate } from "@/utils";
import { cn } from "@/utils";

const PIE_DATA = [
  { name: "Bijoux", value: 38, color: "#c9a96e" },
  { name: "Montres", value: 28, color: "#82a2e0" },
  { name: "Maroquinerie", value: 22, color: "#52c47a" },
  { name: "Mode", value: 12, color: "#e05252" },
];

const ADMIN_ORDERS = [
  {
    id: "#4821",
    customer: "Sophie M.",
    product: "Collier Étoile Dorée",
    amount: 1290,
    status: "DELIVERED",
    date: new Date("2025-05-07"),
  },
  {
    id: "#4820",
    customer: "Laurent D.",
    product: "Montre Lumière Noire",
    amount: 3450,
    status: "SHIPPED",
    date: new Date("2025-05-06"),
  },
  {
    id: "#4819",
    customer: "Amélie C.",
    product: "Sac Cuir Milano",
    amount: 1690,
    status: "PROCESSING",
    date: new Date("2025-05-05"),
  },
  {
    id: "#4818",
    customer: "Marc T.",
    product: "Bracelet Or Blanc Pavé",
    amount: 890,
    status: "DELIVERED",
    date: new Date("2025-05-04"),
  },
  {
    id: "#4817",
    customer: "Claire B.",
    product: "Bague Saphir Royal",
    amount: 2150,
    status: "PROCESSING",
    date: new Date("2025-05-03"),
  },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
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
};

const TABS = [
  "Vue d'ensemble",
  "Produits",
  "Commandes",
  "Utilisateurs",
  "Analytics",
];

function StatCard({
  label,
  value,
  change,
  Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string;
  change: string;
  Icon: React.FC<{ className?: string }>;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            color,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs text-emerald-400 flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" />
          {change}
        </span>
      </div>
      <p className="font-mono text-2xl font-medium mb-1">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
}

export function AdminClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light mb-1">
            Administration
          </h1>
          <p className="text-sm text-muted-foreground">
            Tableau de bord — Vue générale de LUMIÈRE
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:bg-secondary transition-colors"
            whileTap={{ scale: 0.97 }}
            onClick={() => toast.success("Export en cours…")}
          >
            <Download className="w-4 h-4" /> Exporter
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-background rounded-xl text-sm font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.info("Formulaire d'ajout ouvert")}
          >
            <Plus className="w-4 h-4" /> Nouveau produit
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary p-1 rounded-xl w-fit overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              activeTab === i
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab 0: Overview ── */}
      {activeTab === 0 && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Chiffre d'affaires"
              value="€ 128k"
              change="+24.8%"
              Icon={TrendingUp}
              color="bg-[var(--gold)]/10 text-[var(--gold)]"
              delay={0}
            />
            <StatCard
              label="Commandes"
              value="1 247"
              change="+12.3%"
              Icon={ShoppingBag}
              color="bg-emerald-500/10 text-emerald-400"
              delay={0.05}
            />
            <StatCard
              label="Clients actifs"
              value="8 432"
              change="+8.1%"
              Icon={Users}
              color="bg-blue-500/10 text-blue-400"
              delay={0.1}
            />
            <StatCard
              label="Stock critique"
              value="24"
              change="-3"
              Icon={Package}
              color="bg-red-500/10 text-red-400"
              delay={0.15}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
                Revenus mensuels (2025)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [formatPrice(v), "Revenus"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--gold)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "var(--gold)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
                Ventes par catégorie
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {PIE_DATA.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-muted-foreground flex-1">
                      {item.name}
                    </span>
                    <span className="font-mono font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent orders table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Commandes récentes
              </h3>
              <button
                onClick={() => setActiveTab(2)}
                className="text-xs text-[var(--gold)] hover:underline"
              >
                Voir tout →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "ID",
                      "Client",
                      "Produit",
                      "Montant",
                      "Statut",
                      "Date",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ADMIN_ORDERS.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-5 font-mono text-[var(--gold)] text-xs">
                        {order.id}
                      </td>
                      <td className="py-4 px-5 text-sm">{order.customer}</td>
                      <td className="py-4 px-5 text-sm text-muted-foreground max-w-[160px] truncate">
                        {order.product}
                      </td>
                      <td className="py-4 px-5 font-mono text-sm">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            "text-[10px] px-2.5 py-1 rounded-full font-medium",
                            STATUS_CONFIG[order.status]?.className,
                          )}
                        >
                          {STATUS_CONFIG[order.status]?.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-muted-foreground">
                        {formatDate(order.date)}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              toast.info(`Détail commande ${order.id}`)
                            }
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => toast.info("Édition en cours")}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Tab 1: Products ── */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-secondary">
              <Filter className="w-4 h-4" /> Filtrer
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Produit",
                      "Catégorie",
                      "Prix",
                      "Stock",
                      "Statut",
                      "Note",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {product.id}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm text-muted-foreground">
                        {product.category.name}
                      </td>
                      <td className="py-4 px-5 font-mono text-sm">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            product.stock < 5
                              ? "text-red-400"
                              : product.stock < 10
                                ? "text-amber-400"
                                : "text-emerald-400",
                          )}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium",
                            product.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {product.status === "ACTIVE" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-sm text-[var(--gold)] font-mono">
                        {product.rating}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <button
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            onClick={() => toast.info(`Voir ${product.name}`)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            onClick={() => toast.info(`Éditer ${product.name}`)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                            onClick={() =>
                              toast.error(`Supprimer ${product.name} ?`)
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Orders ── */}
      {activeTab === 2 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Toutes les commandes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "ID",
                    "Client",
                    "Produit",
                    "Montant",
                    "Statut",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ...ADMIN_ORDERS,
                  ...ADMIN_ORDERS.map((o) => ({
                    ...o,
                    id: `#${parseInt(o.id.slice(1)) - 5}`,
                  })),
                ].map((order, i) => (
                  <tr
                    key={`${order.id}-${i}`}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-5 font-mono text-[var(--gold)] text-xs">
                      {order.id}
                    </td>
                    <td className="py-4 px-5">{order.customer}</td>
                    <td className="py-4 px-5 text-muted-foreground max-w-[180px] truncate">
                      {order.product}
                    </td>
                    <td className="py-4 px-5 font-mono">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "text-[10px] px-2.5 py-1 rounded-full font-medium",
                          STATUS_CONFIG[order.status]?.className,
                        )}
                      >
                        {STATUS_CONFIG[order.status]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="py-4 px-5">
                      <button
                        className="text-xs text-[var(--gold)] hover:underline"
                        onClick={() => toast.info(`Détails ${order.id}`)}
                      >
                        Voir →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 3: Users ── */}
      {activeTab === 3 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Utilisateurs
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Utilisateur",
                  "Email",
                  "Commandes",
                  "Total dépensé",
                  "Niveau",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3.5 px-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  name: "Sophie Martin",
                  email: "sophie@ex.com",
                  orders: 24,
                  spent: 18420,
                  level: "VIP",
                  initials: "SM",
                },
                {
                  name: "Laurent Dubois",
                  email: "laurent@ex.com",
                  orders: 12,
                  spent: 9840,
                  level: "Or",
                  initials: "LD",
                },
                {
                  name: "Amélie Chen",
                  email: "amelie@ex.com",
                  orders: 8,
                  spent: 4210,
                  level: "Argent",
                  initials: "AC",
                },
                {
                  name: "Marc Torres",
                  email: "marc@ex.com",
                  orders: 3,
                  spent: 1290,
                  level: "Standard",
                  initials: "MT",
                },
              ].map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-background text-xs font-bold">
                        {user.initials}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-muted-foreground text-xs">
                    {user.email}
                  </td>
                  <td className="py-4 px-5 font-mono">{user.orders}</td>
                  <td className="py-4 px-5 font-mono">
                    {formatPrice(user.spent)}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={cn(
                        "text-[10px] px-2.5 py-1 rounded-full font-medium",
                        user.level === "VIP"
                          ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                          : user.level === "Or"
                            ? "bg-amber-500/10 text-amber-400"
                            : user.level === "Argent"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-muted text-muted-foreground",
                      )}
                    >
                      {user.level}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <button
                      className="text-xs text-[var(--gold)] hover:underline"
                      onClick={() => toast.info(`Profil ${user.name}`)}
                    >
                      Voir →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 4: Analytics ── */}
      {activeTab === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Taux de conversion", value: "68.4%", change: "+3.2%" },
              { label: "Panier moyen", value: "€ 1 024", change: "+8.5%" },
              {
                label: "Durée de session",
                value: "4.2 min",
                change: "-0.3 min",
              },
              {
                label: "Taux de retour clients",
                value: "74.1%",
                change: "+1.8%",
              },
            ].map((m, i) => (
              <div
                key={m.label}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <p className="font-mono text-2xl font-medium mb-1">{m.value}</p>
                <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
                <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {m.change}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Revenus vs Commandes
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={REVENUE_DATA} barSize={16}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: 12,
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="var(--gold)"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.9}
                  name="Revenus"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="#82a2e0"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.7}
                  name="Commandes"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
