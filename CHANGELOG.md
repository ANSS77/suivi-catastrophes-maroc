# Changelog

## [1.0.0] - 2026-05-12

### Ajouté
- **Backend Django complet** avec MongoDB (MongoEngine)
  - Authentification JWT (inscription, connexion, déconnexion)
  - Gestion des utilisateurs avec rôles (user/admin)
  - Modèles pour catastrophes (Disaster, Earthquake, Flood, Wildfire)
  - Système d'alertes et notifications
  - Prédictions ML avec scikit-learn
  - Collecteur de données automatique via Celery
  - Adapters pour USGS, NASA FIRMS, NASA POWER

- **Frontend React + Vite + Tailwind**
  - Pages: Login, Register, Home (carte), Alerts, History, Profile, Admin
  - Carte interactive du Maroc avec Leaflet
  - Composants réutilisables (Navbar, Sidebar, Cards, etc.)
  - Auth context avec protection des routes
  - Services API avec interceptors JWT

- **Tests unitaires**
  - Tests pour les modèles User, Disaster, Alert, Notification, Prediction, Collector
  - Tests pour les API endpoints d'authentification
  - Tests pour les seuils d'alerte
  - Tests pour la gestion admin des utilisateurs
  - Tests pour le collecteur et les prédictions

### Corrigé
- Sécurité des endpoints admin (vérification du rôle admin ajoutée)
- Pagination dans UserTable (correction de la gestion des données)
- Inscription → connexion automatique après inscription
- Marquage de toutes les notifications comme lues (nouvel endpoint optimisé)

### Fonctionnalités ajoutées
- Endpoint `/api/notifications/mark-all-read/` pour marquer toutes les notifications
- Endpoint `/api/admin/collect/` pour collecte manuelle (admin)
- Endpoint GET `/api/admin/collect/` pour le statut du collecteur

---

## [0.1.0] - 2026-04-01

### Ajouté
- Structure initiale du projet
- README.md avec documentation complète
- Analyse des besoins
- Diagrammes UML
- Maquettes UI
