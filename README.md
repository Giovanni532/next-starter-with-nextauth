# 🎯 Next.js 15 - Starter Kit  
## Un kit de démarrage moderne pour Next.js 15 avec authentication, gestion d'état et ORM intégrés.

---

## 🚀 Technologies

- **Framework** : Next.js 15  
- **Base de données** : PostgreSQL  
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
✅ **Admin Panel** : Interface d'administration protégée par rôle

---

## 📋 Structure du projet
├── 📂 app/              # Routes Next.js
├── 📂 components/         # Composants UI
├── 📂 prisma/             # Schéma et migrations Prisma
├── 📂 lib/                # Fonctions utilitaires
├── 📂 validations/        # Schema Zod
├── 📂 actions/            # Actions pour la mutations de donnée côtér serveur
├── 📂 scripts/            # Scripts utilitaires pour le projet


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
DATABASE_URL=votre_url_postgresql
AUTH_TRUST_HOST=http://localhost:3000
```

### 3. Lancement

```bash
pnpm run dev
# ou
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### 4. Création d'un compte administrateur

Pour créer un compte administrateur par défaut (email: admin@example.com, mot de passe: Admin123!), exécutez :

```bash
pnpm run create-admin
# ou
npm run create-admin
```

Vous pouvez également modifier les informations d'identification par défaut dans le fichier `scripts/create-admin.ts` avant d'exécuter la commande.

Une fois créé, vous pourrez vous connecter à l'interface d'administration à l'adresse [http://localhost:3000/admin1208](http://localhost:3000/admin1208)

---

## 🐳 Utilisation avec Docker

Le projet est entièrement configuré pour fonctionner avec Docker, ce qui facilite le déploiement et garantit une consistance entre les environnements de développement et de production.

### Prérequis

- Docker et Docker Compose installés sur votre système
- Connaissances de base des commandes Docker

### Environnement de développement

Pour démarrer l'environnement de développement avec le rechargement à chaud (hot reloading) :

```bash
# Démarrer les conteneurs
docker compose -f docker-compose.dev.yml up

# Dans un nouveau terminal, exécuter les migrations Prisma (première fois uniquement)
docker compose -f docker-compose.dev.yml exec app sh -c "./prisma-migrate.sh"
```

Cela va :
1. Démarrer l'application Next.js en mode développement avec rechargement à chaud
2. Démarrer une base de données PostgreSQL
3. Monter votre répertoire local dans le conteneur pour que les modifications de code soient prises en compte en temps réel

#### Accès à l'application

- Application web : http://localhost:3000
- Base de données PostgreSQL : localhost:5433 (accessible depuis votre machine hôte)

### Environnement de production

Pour démarrer l'environnement de production :

```bash
# Construire et démarrer les conteneurs
docker compose -f docker-compose.prod.yml up -d

# Exécuter les migrations Prisma (si nécessaire)
docker compose -f docker-compose.prod.yml exec app sh -c "./prisma-migrate.sh"
```

Cela va :
1. Construire une version optimisée de l'application Next.js pour la production
2. Démarrer une base de données PostgreSQL
3. Exécuter l'application avec une taille de conteneur minimale

#### Accès à l'application

- Application web : http://localhost:3000
- La base de données PostgreSQL n'est pas exposée par défaut (pour des raisons de sécurité)

### Configuration de la base de données

L'application est configurée pour se connecter à PostgreSQL avec ces paramètres par défaut :

- Nom d'utilisateur : postgres
- Mot de passe : postgres
- Base de données : nextauth_db
- Hôte : db (dans le réseau Docker) ou localhost (depuis votre machine)

### Commandes utiles

```bash
# Afficher les logs
docker compose -f docker-compose.dev.yml logs -f

# Accéder au shell du conteneur de l'application
docker compose -f docker-compose.dev.yml exec app sh

# Accéder au conteneur de la base de données
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d nextauth_db

# Arrêter les conteneurs
docker compose -f docker-compose.dev.yml down

# Arrêter les conteneurs et supprimer les volumes (supprimera les données de la base de données)
docker compose -f docker-compose.dev.yml down -v
```

Remplacez `docker-compose.dev.yml` par `docker-compose.prod.yml` pour les commandes en production.

