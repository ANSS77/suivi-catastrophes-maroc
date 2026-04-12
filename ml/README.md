# 📁 Documentation ML — DisasterTrack Maroc


## 📊 Vue d'ensemble

| Phénomène | API Source | Modèle | Fichier Data | Fichier Modèle |
|---|---|---|---|---|
| 🏔️ Séismes | USGS Earthquake API | Random Forest | `data_seismes.csv` | `model_seismes.pkl` |
| 🌊 Inondations | NASA POWER API | Random Forest | `data_inondations.csv` | `model_inondations.pkl` |
| 🔥 Incendies | NASA FIRMS (MODIS) | Random Forest | `data_incendies.csv` | `model_incendies.pkl` |

---

## 🏗️ Structure du dossier ML

```
ml/
├── data/
│   ├── data_seismes.csv            ← données prêtes entraînement
│   ├── data_inondations.csv        ← données prêtes entraînement
│   └── data_incendies.csv          ← données prêtes entraînement
│     
├── notebooks/
│   ├── seismes_training.ipynb
│   ├── inondations_training.ipynb
│   └── incendies_training.ipynb
│
├── models/
│   ├── model_seismes.pkl
│   ├── model_inondations.pkl
│   └── model_incendies.pkl
│
├── preprocess/                    
│   └── preprocess.py                ← les fonctions réutilisables 
│
└── README.md                     
```

---

## 🏔️ Phénomène 1 — Séismes

### Source de données
- **API** : USGS Earthquake Catalog
- **URL** : `https://earthquake.usgs.gov/fdsnws/event/1/query`
- **Période** : 1960 → 2026
- **Paramètres de requête** :
```
format=csv
starttime=1960-01-01
endtime=2026-01-01
minlatitude=27.6
maxlatitude=35.9
minlongitude=-13.2
maxlongitude=-1.0
minmagnitude=2.0
```

### Colonnes brutes (22 colonnes)
```
time, latitude, longitude, depth, mag, magType, nst, gap, dmin, rms,
net, id, updated, place, type, horizontalError, depthError,
magError, magNst, status, locationSource, magSource
```

### Étapes de nettoyage

| Étape | Action | Raison |
|---|---|---|
| 1 | Supprimer 15 colonnes techniques | `nst, gap, dmin, rms, net, id, updated, type, horizontalError, depthError, magError, magNst, status, locationSource, magSource` |
| 2 | Filtrer `place` contenant "Morocco" | Exclure Algérie, Espagne |
| 3 | Supprimer valeurs manquantes | `dropna()` |
| 4 | Convertir `time` en datetime | Format standard |

### Colonnes finales (8 colonnes)
```
time, latitude, longitude, depth, mag, magType, place, severity_label
```

### Label — `severity_label`
| Valeur | Condition | Description |
|---|---|---|
| `low` | mag < 3.5 | Séisme faible |
| `medium` | 3.5 ≤ mag < 4.5 | Séisme modéré |
| `high` | mag ≥ 4.5 | Séisme fort |

### Statistiques finales
```
Lignes totales : 2,225
low            : 1,367  (61%)
medium         :   750  (34%)
high           :   108   (5%)
Valeurs manquantes : 0
```

### Features du modèle
```
latitude, longitude, depth, mag, magType (encodé)
```

---

## 🌊 Phénomène 2 — Inondations

### Source de données
- **API** : NASA POWER (Precipitation Data)
- **URL** : `https://power.larc.nasa.gov/api/temporal/daily/point`
- **Période** : 1990 → 2025
- **Paramètre principal** : `PRECTOTCORR` (Precipitation Corrected mm/jour)
- **Méthode** : Un appel API par région × par année

### 12 Régions du Maroc utilisées
```python
regions = [
    {"name": "Tanger-Tetouan-Al Hoceima",  "lat": 35.77, "lon": -5.80},
    {"name": "Oriental",                    "lat": 34.68, "lon": -1.91},
    {"name": "Fes-Meknes",                  "lat": 34.03, "lon": -5.00},
    {"name": "Rabat-Sale-Kenitra",          "lat": 34.02, "lon": -6.84},
    {"name": "Beni-Mellal-Khenifra",        "lat": 32.34, "lon": -6.35},
    {"name": "Casablanca-Settat",           "lat": 33.59, "lon": -7.62},
    {"name": "Marrakech-Safi",              "lat": 31.63, "lon": -8.00},
    {"name": "Draa-Tafilalet",              "lat": 30.93, "lon": -6.93},
    {"name": "Souss-Massa",                 "lat": 30.42, "lon": -9.59},
    {"name": "Guelmim-Oued Noun",           "lat": 28.98, "lon": -10.05},
    {"name": "Laayoune-Sakia El Hamra",     "lat": 27.15, "lon": -13.20},
    {"name": "Dakhla-Oued Ed-Dahab",        "lat": 23.69, "lon": -15.93},
]
```

### Étapes de nettoyage

| Étape | Action | Raison |
|---|---|---|
| 1 | Supprimer jours avec `PRECTOTCORR < 1mm` | Jours secs sans valeur prédictive |
| 2 | Supprimer aberrations Dakhla 2021 (DOY 82-85) | Erreur capteur satellite (632mm impossible) |
| 3 | Ajouter colonne `season` depuis `DOY` | Feature importante pour les inondations |
| 4 | Ajouter `precip_3days` et `precip_7days` | Pluie cumulée = meilleur indicateur inondation |

### Colonnes finales (10 colonnes)
```
YEAR, DOY, PRECTOTCORR, region, latitude, longitude,
season, flood_risk, precip_3days, precip_7days
```

### Label — `flood_risk`
| Valeur | Condition | Description |
|---|---|---|
| `low` | précip < 8mm | Pluie faible |
| `medium` | 8mm ≤ précip < 20mm | Pluie modérée |
| `high` | précip ≥ 20mm | Pluie forte — risque inondation |

### Statistiques finales
```
Lignes totales : 21,845
low            : 16,428  (75%)
medium         :  4,155  (19%)
high           :  1,262   (6%)
Valeurs manquantes : 0
```

### Features du modèle
```
PRECTOTCORR, precip_3days, precip_7days, DOY, latitude, longitude, season (encodé)
```

### ⚠️ Note importante — Production
En production, `precip_3days` et `precip_7days` sont calculés dynamiquement depuis MongoDB :
```python
# Avant chaque prédiction, Collector récupère l'historique
historique = Disaster.objects.filter(region=region, date__gte=today-7days)
precip_3days = sum(historique[-3:])
precip_7days = sum(historique[-7:])
```

---

## 🔥 Phénomène 3 — Incendies

### Source de données
- **API** : NASA FIRMS (Fire Information for Resource Management System)
- **Instrument** : MODIS
- **URL** : `https://firms.modaps.eosdis.nasa.gov/country/`
- **Période** : 2000 → 2024
- **Format** : CSV par année (`modis_{year}_Morocco.csv`)

### Colonnes brutes (15 colonnes)
```
latitude, longitude, brightness, scan, track, acq_date, acq_time,
satellite, instrument, confidence, version, bright_t31, frp, daynight, type
```

### Étapes de nettoyage

| Étape | Action | Raison |
|---|---|---|
| 1 | Fusionner 25 fichiers CSV (2000→2024) | Un fichier par année |
| 2 | Filtrer `type == 0` | Garder seulement feux de végétation |
| 3 | Filtrer `confidence >= 30` | Exclure détections peu fiables |
| 4 | Supprimer colonnes inutiles | `scan, track, acq_time, satellite, instrument, version, bright_t31, type` |
| 5 | Extraire `month` et `season` depuis `acq_date` | Feature temporelle |

### Colonnes finales (11 colonnes)
```
latitude, longitude, brightness, acq_date, confidence,
frp, daynight, year, month, season, fire_risk
```

### Label — `fire_risk`
| Valeur | Condition | Description |
|---|---|---|
| `low` | frp < 20 MW | Petit feu |
| `medium` | 20 ≤ frp < 100 MW | Feu modéré |
| `high` | frp ≥ 100 MW | Grand incendie |

### Statistiques finales
```
Lignes totales : 7,439
low            : 3,629  (49%)
medium         : 2,930  (39%)
high           :   880  (12%)
Valeurs manquantes : 0
```

### Features du modèle
```
latitude, longitude, brightness, frp, confidence, month, season (encodé), daynight (encodé)
```

---

## 🤖 Approche ML commune

### Algorithme
```
Random Forest Classifier
- class_weight = 'balanced'   ← compenser déséquilibre des classes
- n_estimators = 100
- random_state = 42
```

### Pipeline d'entraînement
```
1. Charger CSV nettoyé
2. Encoder colonnes catégorielles (LabelEncoder)
3. Séparer features (X) et target (y)
4. Split train/test 80/20
5. Entraîner RandomForestClassifier
6. Évaluer (accuracy, classification_report, confusion_matrix)
7. Sauvegarder modèle en .pkl
```

### Output du modèle en production
```
Score   : 0% → 100%
Classes : low / medium / high
Seuil   : si score > seuil configuré → Alert générée
```

---

## 🔄 Flux en production (Celery)

```
Celery (toutes les heures)
    ↓
Collector.collectData()
    ├── USGS API      → données séismes
    ├── NASA POWER    → précipitations
    └── NASA FIRMS    → foyers incendies
    ↓
Collector.normalizeData()
    ├── Filtrer colonnes inutiles
    ├── Calculer precip_3days/7days (inondations)
    └── Filtrer type=0, confidence>=30 (incendies)
    ↓
Stocker dans MongoDB (Disaster collection)
    ↓
Collector.triggerAI()
    ↓
AiModel.predict()
    ├── model_seismes.pkl
    ├── model_inondations.pkl
    └── model_incendies.pkl
    ↓
Prediction.generateAlert()
    ↓
Alert → Notification → User
```

---

## 📦 Dépendances Python

```
pandas
numpy
scikit-learn
joblib          ← sauvegarder/charger .pkl
requests        ← appels API
```

---

*Dernière mise à jour : Avril 2026*