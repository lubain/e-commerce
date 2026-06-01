# LUMIÈRE — E-Commerce Premium

> Plateforme e-commerce construite avec Next.js 15, TypeScript, Tailwind CSS et Framer Motion.

![LUMIÈRE Banner](./public/images/banner.png)

## ✨ Stack Technique

| Technologie                 | Usage                                  |
| --------------------------- | -------------------------------------- |
| **Next.js 15** (App Router) | Framework React fullstack              |
| **TypeScript**              | Typage statique                        |
| **Tailwind CSS**            | Styling utility-first                  |
| **Framer Motion**           | Animations fluides                     |
| **Zustand**                 | State management (Cart, Wishlist)      |
| **React Hook Form + Zod**   | Formulaires & validation               |
| **TanStack Query**          | Data fetching & cache                  |
| **Prisma + PostgreSQL**     | ORM & base de données                  |
| **NextAuth v5**             | Authentification (OAuth + credentials) |
| **Stripe**                  | Paiement en ligne                      |
| **Recharts**                | Graphiques analytics                   |
| **Sonner**                  | Toast notifications                    |

---

## 📁 Architecture du Projet

```
lumiere-ecommerce/
├── app/
│   ├── (shop)/              # Groupe de routes publiques
│   │   ├── page.tsx         # Landing page
│   │   ├── boutique/        # Catalogue produits
│   │   ├── produit/[id]/    # Détail produit
│   │   ├── panier/          # Panier
│   │   └── checkout/        # Tunnel d'achat
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx         # Vue d'ensemble utilisateur
│   │   ├── admin/           # Admin dashboard
│   │   ├── commandes/       # Historique commandes
│   │   ├── wishlist/        # Liste de souhaits
│   │   ├── profil/          # Profil utilisateur
│   │   └── parametres/      # Paramètres compte
│   └── api/
│       ├── products/        # API produits
│       ├── orders/          # API commandes
│       ├── wishlist/        # API wishlist
│       └── stripe/          # Paiement Stripe
│
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── product/             # ProductCard, etc.
│   ├── cart/                # CartDrawer
│   ├── shop/                # SearchModal
│   └── common/              # ThemeProvider, Skeletons...
│
├── features/                # Business logic par domaine
│   ├── products/            # Hero, Shop, Detail...
│   ├── cart/                # CartClient
│   ├── checkout/            # CheckoutClient
│   ├── auth/                # AuthClient
│   └── dashboard/           # DashboardOverview, Admin...
│
├── store/                   # Zustand stores
│   ├── cart.store.ts
│   └── wishlist.store.ts
│
├── hooks/                   # React Query hooks
├── lib/                     # DB, Auth, Stripe, data
├── types/                   # TypeScript types
├── utils/                   # Fonctions utilitaires
└── prisma/                  # Schéma & migrations
```

---

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone https://github.com/votre-repo/lumiere-ecommerce
cd lumiere-ecommerce
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez les variables dans `.env.local` :

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Base de données

```bash
# Initialiser Prisma
npm run db:push

# Seeder les données de démo
npm run db:seed

# Ouvrir Prisma Studio
npm run db:studio
```

### 4. Lancer le serveur

```bash
npm run dev
# → http://localhost:3000
```

---

## 📄 Pages

| Route                   | Description                       |
| ----------------------- | --------------------------------- |
| `/`                     | Landing page avec hero animé      |
| `/boutique`             | Catalogue avec filtres temps réel |
| `/produit/[slug]`       | Détail produit avec galerie       |
| `/panier`               | Gestion du panier                 |
| `/checkout`             | Tunnel d'achat multi-step         |
| `/auth/login`           | Connexion (OAuth + email)         |
| `/auth/register`        | Création de compte                |
| `/dashboard`            | Vue d'ensemble utilisateur        |
| `/dashboard/commandes`  | Historique commandes              |
| `/dashboard/wishlist`   | Liste de souhaits                 |
| `/dashboard/profil`     | Édition profil                    |
| `/dashboard/parametres` | Paramètres & sécurité             |
| `/dashboard/admin`      | Dashboard administrateur          |

---

## 🎨 Design System

### Palette

- **Or** : `#c9a96e` — Accent principal
- **Background** : `hsl(240 10% 4%)` — Dark
- **Card** : `hsl(240 8% 8%)` — Surfaces

### Typographie

- **Cormorant Garamond** — Titres et accents (serif élégant)
- **DM Sans** — Corps de texte (moderne, lisible)
- **DM Mono** — Prix et données chiffrées

### Composants Clés

- **Glass morphism** — `.glass` class
- **Skeleton loading** — `<ProductGridSkeleton />`
- **Toast notifications** — Sonner
- **Animations** — Framer Motion (page transitions, hover, modales)

---

## 🔒 Authentification

NextAuth v5 avec :

- **Google OAuth**
- **GitHub OAuth**
- **Credentials** (email + mot de passe bcrypt)

```typescript
// Protéger une route API
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // ...
}
```

---

## 💳 Paiement Stripe

```typescript
// Créer un Payment Intent
const intent = await stripe.paymentIntents.create({
  amount: Math.round(total * 100), // en centimes
  currency: "eur",
  automatic_payment_methods: { enabled: true },
});
```

Webhook configuré sur `/api/stripe/webhook` pour :

- `payment_intent.succeeded` → Confirmer commande
- `payment_intent.payment_failed` → Annuler commande

---

## 📊 State Management

### Cart Store (Zustand + persist)

```typescript
const { addItem, removeItem, updateQuantity, getTotal } = useCartStore();
```

### Wishlist Store

```typescript
const { toggleItem, isInWishlist } = useWishlistStore();
```

---

## 🌐 API Routes

```
GET    /api/products          # Lister produits (filtrés)
GET    /api/products/[slug]   # Détail produit
POST   /api/orders            # Créer une commande
GET    /api/orders            # Lister mes commandes
POST   /api/stripe            # Créer Payment Intent
POST   /api/stripe/webhook    # Webhook Stripe
GET    /api/wishlist          # Wishlist utilisateur
POST   /api/wishlist          # Ajouter à la wishlist
DELETE /api/wishlist          # Supprimer de la wishlist
```

---

## 🚢 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

Variables d'environnement à configurer sur Vercel :

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 📜 Licence

MIT © 2025 LUMIÈRE

---

_Fait avec ❤️ et beaucoup de café ☕_
