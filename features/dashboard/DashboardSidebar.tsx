"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  User,
  Heart,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/utils";

const USER_NAV = [
  { href: "/dashboard", label: "Vue d'ensemble", Icon: LayoutDashboard },
  { href: "/dashboard/commandes", label: "Mes commandes", Icon: ShoppingBag },
  { href: "/dashboard/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/dashboard/profil", label: "Mon profil", Icon: User },
  { href: "/dashboard/parametres", label: "Paramètres", Icon: Settings },
];

const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Admin Overview", Icon: BarChart3 },
  { href: "/dashboard/admin/produits", label: "Produits", Icon: Package },
  { href: "/dashboard/admin/commandes", label: "Commandes", Icon: ShoppingBag },
  { href: "/dashboard/admin/utilisateurs", label: "Utilisateurs", Icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card/50 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      {/* User card */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center overflow-hidden flex-shrink-0">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-background font-bold text-sm">
                {userInitials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name ?? "Utilisateur"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-2 mb-1">
          Mon compte
        </p>
        {USER_NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  isActive
                    ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
                whileHover={{ x: 2 }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.div>
            </Link>
          );
        })}

        {/* Admin section - only for admins */}
        {isAdmin && (
          <div className="pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 py-2 mb-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Administration
            </p>
            {ADMIN_NAV.map(({ href, label, Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                      isActive
                        ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                    whileHover={{ x: 2 }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors w-full px-3 py-2.5 rounded-xl hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
