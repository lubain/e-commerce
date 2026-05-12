'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingBag, Heart, User, Menu, X,
  ChevronDown, Sun, Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { cn } from '@/utils'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { SearchModal } from '@/components/shop/SearchModal'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Boutique', href: '/boutique' },
  {
    label: 'Collections',
    href: '#',
    children: [
      { label: 'Bijoux', href: '/boutique?category=bijoux' },
      { label: 'Montres', href: '/boutique?category=montres' },
      { label: 'Maroquinerie', href: '/boutique?category=maroquinerie' },
      { label: 'Mode', href: '/boutique?category=mode' },
    ],
  },
  { label: 'Nouveautés', href: '/boutique?sort=newest' },
  { label: 'Soldes', href: '/boutique?sale=true' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const itemCount = useCartStore((s) => s.getItemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.span
              className="font-serif text-2xl font-light tracking-[0.15em] text-[var(--gold)] select-none"
              whileHover={{ opacity: 0.8 }}
            >
              LUMIÈRE
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={cn(
                    'flex items-center gap-1 text-sm font-medium tracking-wide transition-colors',
                    'text-muted-foreground hover:text-foreground uppercase',
                  )}>
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-premium py-1"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wide uppercase transition-colors',
                    pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <motion.button
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-[18px] h-[18px]" />
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Wishlist */}
            <Link href="/dashboard/wishlist">
              <motion.div
                className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--gold)] text-[9px] font-bold text-background rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Cart */}
            <motion.button
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--gold)] text-[9px] font-bold text-background rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Account */}
            <Link href="/auth/login">
              <motion.div
                className="w-9 h-9 hidden md:flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-[18px] h-[18px]" />
              </motion.div>
            </Link>

            {/* Mobile menu toggle */}
            <motion.button
              className="w-9 h-9 lg:hidden flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors ml-1"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container px-4 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.children ? (
                      <div>
                        <p className="px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                          {link.label}
                        </p>
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                          pathname === link.href
                            ? 'text-foreground bg-white/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                  <Link href="/auth/login" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
                    <User className="w-4 h-4" /> Mon compte
                  </Link>
                  <Link href="/dashboard/wishlist" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
                    <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
