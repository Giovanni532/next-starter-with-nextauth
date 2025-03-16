# 🎯 Next.js 15 - Starter Kit  
## Un kit de démarrage moderne pour Next.js 15 avec authentication, gestion d'état et ORM intégrés.

---

## 🚀 Technologies

- **Framework** : Next.js 15  
- **Base de données** : Supabase  
- **ORM** : Prisma  
- **State Management** : Zustand  
- **Authentification** : Auth.js (anciennement NextAuth)  
- **Actions Serveur** : next-safe-action  
- **Validation** : Zod  
- **Composants UI** : Bibliothèque de composants personnalisée  
- **Styles** : Tailwind CSS  

---

## 🌟 Fonctionnalités

✅ **Authentification complète** : Inscription et connexion avec email/mot de passe  
✅ **Server Components** : Optimisation des performances avec React Server Components  
✅ **Server Actions** : Mutations de données sécurisées via next-safe-action  
✅ **TypeScript** : Support complet avec types stricts  
✅ **Responsive Design** : Interface adaptative pour tous les appareils  
✅ **Session Management** : Gestion des sessions utilisateur  
✅ **Dashboard** : Page protégée accessible uniquement aux utilisateurs connectés  

---

## 📋 Structure du projet
├── 📂 app/              # Routes Next.js
├── 📂 components/         # Composants UI
├── 📂 prisma/             # Schéma et migrations Prisma
├── 📂 lib/                # Fonctions utilitaires
├── 📂 validations/        # Schema Zod
├── 📂 actions/            # Actions pour la mutations de donnée côtér serveur


## 🚀 Guide de démarrage

### Prérequis

- Node.js 18+ 
- pnpm ou npm
- Une base de données Supabase

### 1. Installation

```bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd nom-du-projet

# Installer les dépendances
pnpm install
# ou
npm install
```

### 2. Configuration

1. Générer la clé secrète pour l'authentification :
```bash
pnpx auth secret
```

2. Créer un fichier `.env` à la racine du projet :
```env
AUTH_SECRET=votre_clé_secrète
DATABASE_URL=votre_url_supabase
```

### 3. Lancement

```bash
pnpm run dev
# ou
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

