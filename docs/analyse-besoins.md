# 📋 Analyse des Besoins
## 🌍 Application Web de Suivi et d'Alerte sur les Catastrophes Naturelles au Maroc

> **Projet de Fin d'Études (PFE) — 2026**

---

## 👥 1. Les Acteurs

### 🧑‍💻 Acteurs Primaires (Utilisateurs)

#### 👤 1. Visiteur Anonyme
- Accède à la carte sans compte
- Consulte les catastrophes actives au Maroc
- Filtre par type de catastrophe
- Ne reçoit pas d'alertes personnalisées

#### 🔐 2. Utilisateur Enregistré
- Crée un compte et se connecte
- Choisit ses régions à surveiller au Maroc
- Reçoit des alertes en temps réel
- Consulte l'historique de ses alertes

#### 🛡️ 3. Administrateur
- Gère les comptes utilisateurs
- Configure les seuils d'alerte
- Surveille les logs et performances
- Force manuellement une collecte de données

---

### 🤖 Acteurs Automatiques

#### ⚙️ 4. Collecteur Automatique (Celery)
- Se réveille automatiquement toutes les heures
- Interroge les APIs externes (USGS, NASA, OpenWeatherMap)
- Normalise et stocke les nouvelles données dans MongoDB
- Déclenche le modèle IA et génère les alertes

---

### 🌐 Systèmes Externes

| # | Système | Données fournies |
|---|---|---|
| 5 | 🏔️ **USGS** | Données sismiques en temps réel |
| 6 | 🛰️ **NASA FIRMS / EONET** | Incendies et événements naturels |
| 7 | 🌤️ **OpenWeatherMap** | Météo (température, humidité, vent, précipitations) |
| 8 | 🗺️ **OpenStreetMap** | Tuiles de la carte interactive du Maroc |
| 9 | 🔌 **SocketIO** | Communication temps réel — envoie les alertes instantanément aux utilisateurs connectés |

---

## ✅ 2. Les Besoins Fonctionnels

### 👤 Visiteur Anonyme
- Consulter la carte du Maroc
- Voir les catastrophes actives
- Filtrer par type (séismes, inondations, incendies)
- Voir les détails d'un événement

### 🔐 Utilisateur Enregistré
- S'inscrire et se connecter
- Choisir ses régions à surveiller
- Recevoir des alertes en temps réel via SocketIO
- Consulter l'historique de ses alertes
- Gérer son profil et ses préférences

### 🛡️ Administrateur
- Gérer les comptes utilisateurs
- Configurer les seuils d'alerte (seuil) par type de catastrophe
- Consulter les logs et erreurs
- Forcer manuellement une collecte de données
- Activer / désactiver des sources externes

### 🤖 Collecteur Automatique (Celery)
- Interroger les APIs toutes les heures
- Normaliser et stocker les données dans MongoDB
- Calculer un score de risque (0% → 100%) par région
- Déclencher une alerte si le score dépasse le seuil
- Envoyer les alertes via SocketIO aux utilisateurs concernés

---

## 🎯 3. Les Cas d'Utilisation

---

### 1️⃣ S'inscrire

| Champ | Détail |
|---|---|
| **Acteur** | Utilisateur Enregistré |
| **Précondition** | L'utilisateur n'a pas encore de compte |

**Scénario :**
1. L'utilisateur ouvre l'application
2. Il clique sur "S'inscrire"
3. Il remplit nom, email, mot de passe et région
4. Il clique sur "Confirmer"
5. Le système valide les informations
6. Le compte est créé et l'utilisateur est connecté

**Résultat :** Le compte est créé avec succès ✅

---

### 2️⃣ Se connecter

| Champ | Détail |
|---|---|
| **Acteur** | Utilisateur Enregistré |
| **Précondition** | L'utilisateur a déjà un compte |

**Scénario :**
1. L'utilisateur ouvre l'application
2. Il clique sur "Se connecter"
3. Il saisit son email et mot de passe
4. Il clique sur "Confirmer"
5. Le système valide les informations et génère un JWT token
6. L'utilisateur arrive sur la page principale

**Résultat :** L'utilisateur est connecté avec succès ✅

---

### 3️⃣ Consulter la carte

| Champ | Détail |
|---|---|
| **Acteur** | Visiteur Anonyme / Utilisateur Enregistré |
| **Précondition** | Avoir accès à l'application |

**Scénario :**
1. L'utilisateur ouvre l'application
2. Il arrive automatiquement sur la page principale
3. La carte interactive du Maroc s'affiche
4. Les catastrophes actives apparaissent sur la carte
5. L'utilisateur clique sur un événement
6. Les détails s'affichent (type, région, date, niveau de risque)

**Résultat :** L'utilisateur visualise les catastrophes actives au Maroc ✅

---

### 4️⃣ Filtrer par catastrophe

| Champ | Détail |
|---|---|
| **Acteur** | Visiteur Anonyme / Utilisateur Enregistré |
| **Précondition** | Être sur la page principale avec la carte |

**Scénario :**
1. L'utilisateur est sur la page principale
2. Il clique sur le bouton "Filtrer"
3. Une liste de filtres s'affiche (🏔️ Séismes / 🌊 Inondations / 🔥 Incendies)
4. Il sélectionne un ou plusieurs types
5. La carte se met à jour automatiquement
6. Seules les catastrophes sélectionnées s'affichent

**Résultat :** La carte affiche uniquement les catastrophes choisies ✅

---

### 5️⃣ Choisir ses régions

| Champ | Détail |
|---|---|
| **Acteur** | Utilisateur Enregistré |
| **Précondition** | L'utilisateur est connecté |

**Scénario :**
1. L'utilisateur arrive sur la page principale
2. Il clique sur "Mon Profil" ou "Mes Préférences"
3. Il accède à la section "Mes Régions"
4. Il sélectionne une ou plusieurs régions du Maroc
5. Il clique sur "Sauvegarder"
6. Le système enregistre ses préférences dans MongoDB

**Résultat :** Les régions sont sauvegardées — l'utilisateur recevra des alertes uniquement pour ces régions ✅

---

### 6️⃣ Recevoir une alerte

| Champ | Détail |
|---|---|
| **Acteur** | Utilisateur Enregistré |
| **Précondition** | L'utilisateur est connecté et a sauvegardé ses régions |

**Scénario :**
1. Le collecteur automatique (Celery) se réveille
2. Il récupère les données USGS / NASA / OpenWeatherMap
3. Il normalise les données collectées
4. Le modèle IA calcule un score de risque par région
5. Le score dépasse le seuil configuré
6. Django génère une alerte pour les régions concernées
7. Django → SocketIO : émettre l'alerte
8. SocketIO → React : WebSocket event
9. React → Utilisateur : afficher notification toast
10. L'utilisateur clique sur la notification pour voir les détails

**Résultat :** L'utilisateur est notifié en temps réel du risque de catastrophe dans sa région ✅

---

### 7️⃣ Consulter l'historique

| Champ | Détail |
|---|---|
| **Acteur** | Utilisateur Enregistré |
| **Précondition** | L'utilisateur est connecté |

**Scénario :**
1. L'utilisateur clique sur "Historique"
2. Il choisit un filtre (alertes / catastrophes / période)
3. Le frontend envoie une requête à Django
4. Django interroge MongoDB
5. Les données sont retournées au frontend
6. L'historique s'affiche (alertes reçues + catastrophes passées dans sa région)

**Résultat :** L'utilisateur consulte l'historique de ses alertes et des catastrophes dans sa région ✅

---

### 8️⃣ Gérer les utilisateurs

| Champ | Détail |
|---|---|
| **Acteur** | Administrateur |
| **Précondition** | L'administrateur est connecté au panneau /admin |

**Scénario :**
1. L'admin accède à la page /admin
2. Il clique sur "Utilisateurs"
3. La liste complète des utilisateurs s'affiche
4. L'admin sélectionne un utilisateur
5. Il choisit une action :
   - 🔕 Désactiver le compte
   - 🗑️ Supprimer le compte
   - ✏️ Modifier les informations
6. Le système applique l'action dans MongoDB
7. La liste se met à jour automatiquement

**Résultat :** L'action est appliquée avec succès sur le compte utilisateur ✅

---

### 9️⃣ Collecteur récupère les données et génère une alerte

| Champ | Détail |
|---|---|
| **Acteur** | Collecteur Automatique (Celery) |
| **Précondition** | Le système est en cours d'exécution (toutes les heures automatiquement) |

**Scénario :**
1. Celery se réveille automatiquement
2. Il interroge USGS (séismes)
3. Il interroge NASA FIRMS (incendies)
4. Il interroge OpenWeatherMap (météo/inondations)
5. Il normalise et stocke les données dans MongoDB
6. Il lance le modèle IA pour chaque région du Maroc
7. Le modèle calcule un score de risque (0% → 100%)
8. Si le score dépasse le seuil → alerte générée
9. Django → SocketIO : émettre l'alerte
10. SocketIO → React : WebSocket event
11. React → Utilisateur : afficher notification

**Résultat :** Les données sont à jour et les alertes sont envoyées en temps réel aux utilisateurs des régions à risque ✅

---

## 🗺️ 4. Les Contraintes

| Contrainte | Valeur |
|---|---|
| 🌍 **Région** | Maroc entier |
| 🗄️ **Base de données** | MongoDB |
| ⚛️ **Frontend** | React |
| 🐍 **Backend** | Django (Python) |
| 🗺️ **Carte** | Leaflet.js |
| 🤖 **Modèle IA** | Classification supervisée simple (scikit-learn) |
| ⏰ **Tâches automatiques** | Celery (Django) |
| 🔌 **Temps réel** | SocketIO |
| 🔐 **Authentification** | JWT (JSON Web Token) |
| 🌐 **APIs** | USGS, NASA FIRMS, OpenWeatherMap |
| 📁 **Versioning** | Git + GitHub |
| 🌋 **Phénomènes** | Séismes, Inondations, Incendies de forêt |
| 🔄 **Approche** | Développement itératif (1 phénomène par itération) |

---

> ### *Mars 2026 —— Version 2.0*
---