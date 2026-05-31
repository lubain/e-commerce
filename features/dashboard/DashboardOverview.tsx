"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Package,
  ShoppingBag,
  Heart,
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { REVENUE_DATA } from "@/lib/data";
import { formatPrice, formatDate } from "@/utils";
import { cn } from "@/utils";

const RECENT_ORDERS = [
  {
    id: "#LUM-2025-4821",
    product: "Collier Étoile Dorée",
    date: new Date("2025-05-07"),
    amount: 1290,
    status: "DELIVERED",
  },
  {
    id: "#LUM-2025-4756",
    product: "Parfum Signature No. 7",
    date: new Date("2025-04-22"),
    amount: 380,
    status: "DELIVERED",
  },
  {
    id: "#LUM-2025-4612",
    product: "Écharpe Cachemire Alpin",
    date: new Date("2025-04-08"),
    amount: 340,
    status: "DELIVERED",
  },
  {
    id: "#LUM-2025-4490",
    product: "Bague Saphir Royal",
    date: new Date("2025-03-15"),
    amount: 2150,
    status: "DELIVERED",
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
  CANCELLED: { label: "Annulé", className: "bg-red-500/10 text-red-400" },
};

function MetricCard({
  label,
  value,
  change,
  changeType,
  Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down";
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
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
          color,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-mono text-2xl font-medium mb-1">{value}</p>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          changeType === "up" ? "text-emerald-400" : "text-red-400",
        )}
      >
        {changeType === "up" ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {change}
      </div>
    </motion.div>
  );
}

export function DashboardOverview() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl font-light mb-1">
          Bonjour, Sophie 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Voici un aperçu de votre activité et de vos commandes récentes.
        </p>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total dépensé"
          value="€ 4 160"
          change="+12% vs an dernier"
          changeType="up"
          Icon={TrendingUp}
          color="bg-[var(--gold)]/10 text-[var(--gold)]"
          delay={0}
        />
        <MetricCard
          label="Commandes"
          value="4"
          change="+2 ce trimestre"
          changeType="up"
          Icon={ShoppingBag}
          color="bg-emerald-500/10 text-emerald-400"
          delay={0.05}
        />
        <MetricCard
          label="Wishlist"
          value="6"
          change="3 articles en stock"
          changeType="up"
          Icon={Heart}
          color="bg-red-500/10 text-red-400"
          delay={0.1}
        />
        <MetricCard
          label="Points fidélité"
          value="2 480"
          change="Niveau Or"
          changeType="up"
          Icon={Star}
          color="bg-blue-500/10 text-blue-400"
          delay={0.15}
        />
      </div>

      {/* Chart + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Dépenses 2025
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_DATA.slice(0, 5)} barSize={32}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatPrice(v / 10), "Dépenses"]}
              />
              <Bar
                dataKey="revenue"
                fill="var(--gold)"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Loyalty card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#2a2018] to-[#1a130a] border border-[var(--gold)]/20 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs tracking-[0.12em] text-[var(--gold)] uppercase mb-2">
              Programme fidélité
            </p>
            <h3 className="font-serif text-2xl font-light text-white mb-1">
              Niveau Or
            </h3>
            <p className="text-xs text-white/50">
              2 480 / 5 000 points pour Platine
            </p>
          </div>
          <div>
            <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-[var(--gold)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "49.6%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Livraison express",
                "Accès prioritaire",
                "Cadeaux exclusifs",
              ].map((b) => (
                <span
                  key={b}
                  className="text-[10px] px-2 py-1 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/20"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Commandes récentes
          </h2>
          <Link
            href="/dashboard/commandes"
            className="text-xs text-[var(--gold)] hover:underline"
          >
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {RECENT_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center gap-4 p-5 hover:bg-secondary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">
                    {order.product}
                  </p>
                  <span className="font-mono text-sm flex-shrink-0">
                    {formatPrice(order.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-xs text-[var(--gold)]">
                    {order.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.date)}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      STATUS_CONFIG[order.status]?.className,
                    )}
                  >
                    {STATUS_CONFIG[order.status]?.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
