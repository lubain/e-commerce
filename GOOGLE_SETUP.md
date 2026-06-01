# Configuration Google OAuth — Guide étape par étape

## 1. Créer un projet Google Cloud

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com)
2. Cliquez sur **Sélectionner un projet** → **Nouveau projet**
3. Nommez votre projet (ex: `lumiere-ecommerce`)

## 2. Configurer l'écran de consentement OAuth

1. Menu → **APIs et services** → **Écran de consentement OAuth**
2. Choisissez **Externe**
3. Remplissez :
   - Nom de l'application : `LUMIÈRE`
   - Email d'assistance : votre email
   - Domaine autorisé : `localhost` (dev) ou votre domaine (prod)
4. Ajoutez le scope : `email`, `profile`, `openid`
5. Sauvegardez

## 3. Créer les identifiants OAuth

1. Menu → **APIs et services** → **Identifiants**
2. **+ Créer des identifiants** → **ID client OAuth**
3. Type d'application : **Application Web**
4. Nom : `LUMIÈRE Web`
5. **URI de redirection autorisés** — ajoutez :
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   _(et en production : `https://votre-domaine.com/api/auth/callback/google`)_
6. Cliquez **Créer**

## 4. Copier les identifiants

Copiez le **Client ID** et le **Client Secret** dans votre `.env.local` :

```env
AUTH_GOOGLE_ID="xxxx.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
```

## 5. Configurer la base de données

```bash
# Créer la DB et pousser le schéma
npm run db:push

# (Optionnel) Seeder des données de démo
npm run db:seed
```

## 6. Lancer l'application

```bash
npm run dev
```

Rendez-vous sur http://localhost:3000/auth/login → cliquez **Continuer avec Google** ✅

---

## Variables d'environnement requises

| Variable             | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `DATABASE_URL`       | URL PostgreSQL                                           |
| `AUTH_SECRET`        | Secret NextAuth (générez avec `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID`     | Client ID Google OAuth                                   |
| `AUTH_GOOGLE_SECRET` | Client Secret Google OAuth                               |

## Tester sans Google (mode démo)

Sans configurer Google, vous pouvez tester avec l'authentification par email :

- **Email** : `demo@lumiere.fr`
- **Mot de passe** : `password123`

_(Après avoir lancé `npm run db:seed`)_
