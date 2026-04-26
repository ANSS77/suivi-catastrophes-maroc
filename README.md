# 🚨 Suivi des Catastrophes Naturelles au Maroc

**Application web de suivi et d'alerte sur les catastrophes naturelles au Maroc**

> Projet de Fin d'Études (PFE) — 2025/2026

---

## 👨‍💼 Équipe

| Nom | GitHub | LinkedIn |
|-----|--------|----------|
| Anssem Hafid | [@ANSS77](https://github.com/ANSS77) | [LinkedIn](www.linkedin.com/in/hafid-anssem/) |
| Mohamad Amine Haifi | [@Mohamadaminehaifi](https://github.com/Mohamadaminehaifi) | [LinkedIn](https://www.linkedin.com/in/mohamed-amine-haifi-2b945b32b/) |
| Ouchraa Ismail | [@ismailouchraa](https://github.com/ismailouchraa) | [LinkedIn](https://www.linkedin.com/in/ismail-ouchraa-9ba655288/) |

---

## 🎯 Description

**DisasterTrack** est une application web conçue pour surveiller et alerter les utilisateurs sur les catastrophes naturelles (séismes, inondations, incendies) qui surviennent au Maroc. L'application collecte des données en temps réel via plusieurs APIs externes et utilise l'intelligence artificielle pour calculer les risques par région.

### 🌍 Objectifs Principaux

✅ Fournir une carte interactive du Maroc en temps réel  
✅ Alerter les utilisateurs sur les catastrophes naturelles  
✅ Offrir un historique des événements par région  
✅ Permettre aux utilisateurs de personnaliser leurs alertes  
✅ Administrer l'application et gérer les seuils d'alerte  

---

## ⭐ Caractéristiques

### Pour les Visiteurs Anonymes
- 🗺️ Consultation de la carte du Maroc interactive
- 📍 Visualisation des catastrophes actives
- 🔍 Filtrage par type de catastrophe (séismes, inondations, incendies)
- 📊 Détails complets de chaque événement

### Pour les Utilisateurs Enregistrés
- 🔐 Création d'un compte personnel
- 🚨 Alertes en temps réel personnalisées
- 🎯 Sélection des régions à surveiller
- 📈 Accès à l'historique des alertes
- ⚙️ Gestion du profil et des préférences

### Pour les Administrateurs
- 👥 Gestion des comptes utilisateurs
- ⚖️ Configuration des seuils d'alerte
- 📋 Consultation des logs et erreurs
- 🔄 Collecte manuelle de données
- 🔌 Activation/désactivation des sources externes

---

## 🏗️ Architecture

### Pattern MVT (Model - View - Template)

```
MoroccAlert/
├── Models (MongoEngine)     → Données : User, Disaster, Alert, Prediction...
├── Views (DRF APIView)      → Logique métier + APIs REST
└── Templates (React)        → Interface utilisateur
```

### 🔗 Sources de Données Externes

| Source | Type de Données |
|--------|----------------|
| **USGS** 🏔️ | Données sismiques en temps réel |
| **NASA FIRMS** 🛰️ | Incendies et événements naturels |
| **NASA POWER** 🌤️ | Météo (température, humidité, vent, précipitations) |

### 🤖 Composants Principaux

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Frontend** | React.js + Leaflet | Interface utilisateur + Carte interactive |
| **Backend API** | Django REST Framework | APIs REST |
| **Collecteur** | Celery | Collecte horaire via APIs externes |
| **Base de Données** | MongoDB Atlas | Stockage des événements |
| **Modèle IA** | Scikit-learn | Calcul du score de risque par région |
| **Broker** | Redis | Gestion des tâches Celery |

---

## 🗂️ Structure du Projet

```
suivi-catastrophes-maroc/
├── backend/                        # Application Django
│   ├── apps/                       # Applications Django
│   │   ├── alerts/                 # Alertes + Notifications
│   │   │   ├── models/             # Alert, Notification
│   │   │   ├── serializers/        # AlertSerializer, NotificationSerializer
│   │   │   ├── views/              # AlertView, NotificationView
│   │   │   └── urls/               # Routes alerts
│   │   ├── collector/              # Collecte de données externes
│   │   │   ├── adapters/           # USGS, NASA FIRMS, NASA POWER
│   │   │   ├── models/             # Collector
│   │   │   └── tasks.py            # Celery tasks
│   │   ├── core/                   # Utilitaires partagés
│   │   │   ├── models/             # Region
│   │   │   ├── permissions/        # Permissions personnalisées
│   │   │   └── utils/              # Fonctions utilitaires
│   │   ├── disasters/              # Catastrophes naturelles
│   │   │   ├── models/             # Disaster, Earthquake, Flood, Wildfire
│   │   │   ├── serializers/        # DisasterSerializer
│   │   │   ├── views/              # DisasterView, DisasterDetailView, DisasterFilterView
│   │   │   └── urls/               # Routes disasters
│   │   ├── predictions/            # Prédictions ML
│   │   │   ├── models/             # Prediction, AiModel
│   │   │   ├── serializers/        # PredictionSerializer
│   │   │   ├── services/           # Chargement des .pkl + prédiction
│   │   │   └── urls/               # Routes predictions
│   │   └── users/                  # Authentification + Utilisateurs
│   │       ├── models/             # User
│   │       ├── serializers/        # RegisterSerializer, LoginSerializer
│   │       ├── services/           # JWT (authenticate_user, generate_tokens)
│   │       ├── views/              # RegisterView, LoginView, LogoutView
│   │       └── urls/               # Routes auth
│   ├── config/                     # Configuration Django
│   │   ├── settings.py             # Settings (MongoDB, JWT, CORS, Celery)
│   │   ├── urls.py                 # URLs principales
│   │   └── celery.py               # Configuration Celery
│   └── manage.py
├── docs/                           # Documentation
│   ├── maquettes/                  # Maquettes UI (login, home, alerts...)
│   └── uml/                        # Diagrammes UML (Class, Use Case, Sequence)
├── frontend/                       # Application React
│   └── src/
│       ├── api/                    # axios.js (config + interceptors JWT)
│       ├── components/             # Composants réutilisables
│       ├── context/                # AuthContext, AlertContext
│       ├── hooks/                  # useAuth, useAlerts, useMap
│       ├── pages/                  # LoginPage, RegisterPage, HomePage...
│       ├── routes/                 # AppRoutes.jsx (React Router + Auth Guard)
│       └── services/               # authService, disasterService, alertService
├── ml/                             # Machine Learning
│   ├── data/                       # Datasets (séismes, inondations, incendies)
│   ├── models/                     # Modèles .pkl (non pushés → Google Drive)
│   └── notebooks/                  # Notebooks d'entraînement
├── .gitignore
├── README.md
└── requirements.txt                # Dépendances Python (racine du projet)
```

---

## 🛠️ Technologies Utilisées

### Backend
- **Django 6.0** — Framework web Python
- **Django REST Framework** — APIs REST
- **MongoEngine** — ODM pour MongoDB
- **MongoDB Atlas** — Base de données NoSQL cloud
- **Celery + Redis** — Tâches asynchrones et planifiées
- **djangorestframework-simplejwt** — Authentification JWT

### Frontend
- **React.js** — Framework JavaScript
- **Leaflet** — Cartes interactives
- **Axios** — Client HTTP + interceptors JWT
- **React Router** — Navigation + Auth Guard
- **Tailwind CSS** — Styles

### Machine Learning
- **Scikit-learn** — Modèles Random Forest
- **Imbalanced-learn** — SMOTE pour rééquilibrage
- **Pandas / NumPy** — Traitement des données

---

## 📐 Diagrammes UML

### Diagramme de Cas d'Utilisation
![Cas d'Utilisation](docs/uml/exported/use-case.png)

### Diagramme de Classes
![Diagramme de Classes](docs/uml/exported/Class.png)

> 📁 Voir [docs/uml/exported/sequence/](docs/uml/exported/sequence/) pour les diagrammes de séquence.

---

## 🚀 Installation & Lancement

### Prérequis

- Python 3.10+
- Node.js 18+
- Redis (pour Celery)
- Compte MongoDB Atlas

### 1. Cloner le projet

```bash
git clone https://github.com/hafid/suivi-catastrophes-maroc.git
cd suivi-catastrophes-maroc
```

### 2. Configuration Backend

```bash
# Créer et activer l'environnement virtuel
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Installer les dépendances (requirements.txt est à la racine)
pip install -r requirements.txt

# Créer le fichier .env dans backend/
# Contenu du .env :
SECRET_KEY=your_django_secret_key
DEBUG=True
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/moroccalert_db
MONGO_DB=moroccalert_db
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env dans frontend/
# Contenu du .env :
VITE_API_URL=http://localhost:8000
```

### 4. Lancer l'application

**Terminal 1 — Backend Django :**
```bash
cd backend
python manage.py runserver
# → http://localhost:8000
```

**Terminal 2 — Frontend React :**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

**Terminal 3 — Celery (optionnel) :**
```bash
cd backend
celery -A config worker --loglevel=info
```

---

## ✅ Besoins Fonctionnels

### Visiteur Anonyme
- [ ] Consulter la carte du Maroc
- [ ] Voir les catastrophes actives
- [ ] Filtrer par type (séismes, inondations, incendies)
- [ ] Voir les détails d'un événement

### Utilisateur Enregistré
- [ ] S'inscrire et se connecter
- [ ] Choisir ses régions à surveiller
- [ ] Recevoir des alertes en temps réel
- [ ] Consulter l'historique des alertes
- [ ] Gérer son profil et ses préférences

### Administrateur
- [ ] Gérer les comptes utilisateurs
- [ ] Configurer les seuils d'alerte par type
- [ ] Consulter les logs et erreurs
- [ ] Forcer une collecte manuelle de données

### Collecteur Automatique (Celery)
- [ ] Interroger les APIs toutes les heures
- [ ] Normaliser et stocker les données
- [ ] Calculer un score de risque par région
- [ ] Déclencher une alerte si seuil dépassé
- [ ] Envoyer les alertes aux utilisateurs concernés

---

## 📚 Documentation Supplémentaire

- 📋 [Analyse des Besoins](docs/analyse-besoins.md)
- 🎨 [Maquettes](docs/maquettes/)
- 📐 [Diagrammes UML](docs/uml/)

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**Dernière mise à jour** : Avril 2026
