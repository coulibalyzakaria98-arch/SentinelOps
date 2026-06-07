# ❓ Foire Aux Questions (FAQ) - SentinelOps

Ce document prépare l'équipe technique à répondre aux questions courantes lors de la démonstration UNDP.

---

## 🏗️ Architecture & Technique

### 1. Pourquoi utiliser une architecture multi-plateforme (Vercel/Render/Neon) ?
**Réponse :** Pour maximiser la résilience et la performance tout en restant sur des offres gratuites. Vercel gère le contenu statique globalement (Edge), Render fait tourner le moteur logique (FastAPI), et Neon offre une base de données PostgreSQL serverless qui s'adapte à la charge.

### 2. Le système peut-il fonctionner réellement sans internet ?
**Réponse :** Oui. SentinelOps est conçu avec une approche "Offline-First". Les rapports sont stockés localement dans le navigateur (IndexedDB via Dexie). Dès que la connexion est rétablie, un gestionnaire de synchronisation en arrière-plan envoie les données au serveur sans action de l'utilisateur.

### 3. Quelles sont les technologies utilisées pour la fusion de données ?
**Réponse :** Nous utilisons FastAPI pour traiter les signaux en temps réel. La fusion s'appuie sur des algorithmes de scoring géo-spatiaux (PostGIS) qui valident la pertinence d'une alerte en fonction de sa proximité avec d'autres signaux et de la fiabilité de l'émetteur.

---

## 🔒 Sécurité & Confidentialité

### 4. Comment les données des citoyens sont-elles protégées ?
**Réponse :** Toutes les transmissions se font via HTTPS (SSL). Les données sensibles (comme les photos) peuvent être anonymisées ou chiffrées. En production, nous recommandons l'utilisation de Cloudinary avec des options de sécurité strictes pour le stockage des médias.

### 5. Qui a accès au Centre de Commandement ?
**Réponse :** Le système utilise un contrôle d'accès basé sur les rôles (RBAC). Seuls les utilisateurs authentifiés avec les rôles `command` ou `admin` peuvent visualiser la carte tactique globale et les analyses stratégiques.

---

## 📈 Évolutivité (Scalability)

### 6. Que se passe-t-il si 10 000 personnes envoient un rapport en même temps ?
**Réponse :** L'architecture est prête à passer à l'échelle. Le backend FastAPI est asynchrone (ASGI), ce qui lui permet de gérer des milliers de connexions simultanées. La base de données Neon est "autoscaling" et peut augmenter ses ressources instantanément.

### 7. Peut-on ajouter d'autres langues ?
**Réponse :** Absolument. Le système utilise `i18next`. Ajouter une 7ème langue prend moins de 10 minutes : il suffit de créer un nouveau fichier JSON de traduction. L'interface s'adapte automatiquement (LTR ou RTL).

---

## 📸 Fonctionnalités Spécifiques

### 8. La caméra fonctionne-t-elle sur tous les téléphones ?
**Réponse :** Nous utilisons un module "Optique" dédié qui gère les contraintes matérielles. Il privilégie la caméra arrière pour les rapports de dégâts et dispose d'un système de repli (fallback) si le matériel est restreint.

### 9. Comment sont calculées les tendances analytiques ?
**Réponse :** Les statistiques sont agrégées en temps réel par le backend. Elles ne sont pas statiques. Chaque fois qu'une alerte est validée, le dashboard analytique met à jour ses graphiques de répartition et ses courbes temporelles.
