'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react'

const FOOTER_LINKS = {
  boutique: [
    { label: 'Nouveautés', href: '/boutique?sort=newest' },
    { label: 'Bijoux', href: '/boutique?category=bijoux' },
    { label: 'Montres', href: '/boutique?category=montres' },
    { label: 'Maroquinerie', href: '/boutique?category=maroquinerie' },
    { label: 'Soldes', href: '/boutique?sale=true' },
  ],
  aide: [
    { label: 'Livraison & retours', href: '/livraison' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Guide des tailles', href: '/guide-tailles' },
    { label: 'Entretien', href: '/entretien' },
  ],
  marque: [
    { label: 'Notre histoire', href: '/histoire' },
    { label: 'Artisans', href: '/artisans' },
    { label: 'Durabilité', href: '/durabilite' },
    { label: 'Presse', href: '/presse' },
    { label: 'Carrières', href: '/carrieres' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      {/* Newsletter */}
      <div className="border-b border-border/50">
        <div className="container py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.15em] text-[var(--gold)] uppercase mb-3">
              Newsletter
            </p>
            <h2 className="font-serif text-3xl font-light mb-4">
              L'excellence, <em className="italic">en avant-première</em>
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Recevez nos nouvelles collections, offres exclusives et invitations privées.
            </p>
            <form
              className="flex gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-secondary border border-border rounded-full px-5 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
              />
              <motion.button
                type="submit"
                className="bg-[var(--gold)] text-background rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                S'inscrire <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="font-serif text-3xl font-light tracking-[0.12em] text-[var(--gold)]">
              LUMIÈRE
            </span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Maison de création française fondée en 2018. L'excellence artisanale au service de l'élégance contemporaine, depuis Paris.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-5">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LUMIÈRE — Tous droits réservés
          </p>
          <div className="flex gap-6">
            {['Confidentialité', 'CGV', 'Mentions légales', 'Cookies'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Paiements sécurisés</span>
            {['Visa', 'MC', 'AMEX', 'PayPal'].map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded border border-border text-[10px] font-mono"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
