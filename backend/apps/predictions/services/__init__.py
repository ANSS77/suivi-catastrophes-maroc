import pickle
import numpy as np
from pathlib import Path
from datetime import datetime, timezone

from apps.disasters.models import Earthquake, Flood, Wildfire, Disaster
from apps.predictions.models import Prediction, AiModel
from apps.core.constants import ALERT_THRESHOLDS
from apps.alerts.services import create_alert_and_notify

# ─── Chemin vers les modèles .pkl ───
MODELS_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent / 'ml' / 'models'


# ─── Chargement des modèles ───
def load_model(filename):
    path = MODELS_DIR / filename
    with open(path, 'rb') as f:
        return pickle.load(f)


def initialize_ai_models():
    """
    Charge les .pkl et crée/met à jour les AiModel dans MongoDB.
    Appelé au démarrage du serveur.
    """
    global EARTHQUAKE_PKL, FLOOD_PKL, WILDFIRE_PKL

    # ─── Séismes ───
    try:
        EARTHQUAKE_PKL = load_model('earthquake_model.pkl')
        AiModel.objects(phenomenon='earthquake').update_one(
            set__modelType='Random Forest',
            set__accuracy=0.9367,
            set__lastTrained=datetime.now(timezone.utc),
            upsert=True
        )
        print("✅ earthquake_model.pkl chargé")
    except Exception as e:
        EARTHQUAKE_PKL = None
        print(f"❌ Erreur chargement earthquake_model: {e}")

    # ─── Inondations ───
    try:
        FLOOD_PKL = load_model('flood_model.pkl')
        AiModel.objects(phenomenon='flood').update_one(
            set__modelType='Logistic Regression',
            set__accuracy=0.8941,
            set__lastTrained=datetime.now(timezone.utc),
            upsert=True
        )
        print("✅ flood_model.pkl chargé")
    except Exception as e:
        FLOOD_PKL = None
        print(f"❌ Erreur chargement flood_model: {e}")

    # ─── Incendies ───
    try:
        WILDFIRE_PKL = load_model('wildfire_model.pkl')
        AiModel.objects(phenomenon='wildfire').update_one(
            set__modelType='Random Forest',
            set__accuracy=0.9216,
            set__lastTrained=datetime.now(timezone.utc),
            upsert=True
        )
        print("✅ wildfire_model.pkl chargé")
    except Exception as e:
        WILDFIRE_PKL = None
        print(f"❌ Erreur chargement wildfire_model: {e}")


# Initialiser au démarrage
EARTHQUAKE_PKL = FLOOD_PKL = WILDFIRE_PKL = None
initialize_ai_models()


# ════════════════════════════════════════════════
# SÉISMES — Random Forest
# ════════════════════════════════════════════════
def predict_earthquake(earthquake: Earthquake) -> dict:
    if EARTHQUAKE_PKL is None:
        return None

    model    = EARTHQUAKE_PKL['model']
    scaler   = EARTHQUAKE_PKL['scaler']
    le       = EARTHQUAKE_PKL['le']
    features = EARTHQUAKE_PKL['features']

    nst = earthquake.nst if earthquake.nst else 0
    gap = earthquake.gap if earthquake.gap else 0

    X = np.array([[
        earthquake.latitude,
        earthquake.longitude,
        earthquake.depth,
        nst,
        gap,
    ]])

    X_scaled     = scaler.transform(X)
    pred_encoded = model.predict(X_scaled)[0]
    pred_proba   = model.predict_proba(X_scaled)[0]
    label        = le.inverse_transform([pred_encoded])[0]
    score        = float(max(pred_proba) * 100)

    return {'label': label, 'score': score}


# ════════════════════════════════════════════════
# INONDATIONS — Régression Logistique
# ════════════════════════════════════════════════
def predict_flood(flood: Flood) -> dict:
    if FLOOD_PKL is None:
        return None

    model     = FLOOD_PKL['model']
    scaler    = FLOOD_PKL['scaler']
    le_region = FLOOD_PKL['le_region']
    le_target = FLOOD_PKL['le_target']

    try:
        region_enc = le_region.transform([flood.region])[0]
    except Exception:
        region_enc = 0

    X = np.array([[
        flood.PRECTOTCORR,
        flood.RH2M,
        flood.T2M,
        flood.WS2M,
        flood.GWETTOP,
        flood.PS,
        flood.month,
        flood.day_of_year,
        region_enc,
    ]])

    X_scaled     = scaler.transform(X)
    pred_encoded = model.predict(X_scaled)[0]
    pred_proba   = model.predict_proba(X_scaled)[0]
    label        = le_target.inverse_transform([pred_encoded])[0]
    score        = float(max(pred_proba) * 100)

    return {'label': label, 'score': score}


# ════════════════════════════════════════════════
# INCENDIES — Random Forest
# ════════════════════════════════════════════════
def predict_wildfire(wildfire: Wildfire) -> dict:
    if WILDFIRE_PKL is None:
        return None

    model  = WILDFIRE_PKL['model']
    scaler = WILDFIRE_PKL['scaler']
    le     = WILDFIRE_PKL['le']

    X = np.array([[
        wildfire.latitude,
        wildfire.longitude,
        wildfire.bright_ti4,
        wildfire.bright_ti5,
        wildfire.scan,
        wildfire.track,
        wildfire.confidence,
        wildfire.daynight_enc,
        wildfire.month,
        wildfire.day_of_year,
        wildfire.type,
    ]])

    X_scaled     = scaler.transform(X)
    pred_encoded = model.predict(X_scaled)[0]
    pred_proba   = model.predict_proba(X_scaled)[0]
    label        = le.inverse_transform([pred_encoded])[0]
    score        = float(max(pred_proba) * 100)

    return {'label': label, 'score': score}

# ════════════════════════════════════════════════
# PIPELINE COMPLET — Après prédiction
# ════════════════════════════════════════════════
def process_prediction(result: dict, phenomenon: str, obj, region: str, latitude: float, longitude: float):
    """
    Après prédiction :
    1. Mettre à jour le document MongoDB
    2. Récupérer l'AiModel utilisé
    3. Sauvegarder dans Prediction (anti-doublon par région + phénomène + jour)
    4. Créer Disaster si risque medium/high
    5. Log si score >= seuil (Alert créée lors de l'intégration)
    """
    if result is None:
        return

    label = result['label']
    score = result['score']

    # 1. Mettre à jour le document MongoDB
    if phenomenon == 'earthquake':
        obj.severity_label = label
    elif phenomenon == 'flood':
        obj.flood_risk = label
    elif phenomenon == 'wildfire':
        obj.fire_risk = label
    obj.save()

    # 2. Récupérer l'AiModel utilisé
    ai_model = AiModel.objects(phenomenon=phenomenon).first()

    # 3. Sauvegarder dans Prediction (anti-doublon)
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    existing = Prediction.objects(
        region=region,
        phenomenon=phenomenon,
        date__gte=today
    ).first()

    if not existing:
        Prediction(
            score=score / 100,
            region=region,
            phenomenon=phenomenon,
            date=datetime.now(timezone.utc),
        ).save()

    # 4. Créer Disaster si risque medium ou high
    if label in ['medium', 'high']:
        Disaster(
            type=phenomenon,
            region=region,
            latitude=latitude,
            longitude=longitude,
            date=datetime.now(timezone.utc),
            severity=label,
            source=f"ML — {ai_model.modelType if ai_model else 'Unknown'}",
            isActive=True,
        ).save()

    # 5. Log si score >= seuil
    threshold = ALERT_THRESHOLDS.get(phenomenon, 70.0)
    if score >= threshold:
        create_alert_and_notify(
            phenomenon=phenomenon,
            region=region,
            score=score,
            severity=label,
        )

# ════════════════════════════════════════════════
# FONCTIONS PRINCIPALES — Appelées par Celery
# ════════════════════════════════════════════════
def run_earthquake_predictions():
    """Prédit pour tous les séismes sans severity_label."""
    earthquakes = Earthquake.objects(severity_label=None)
    count = 0
    for eq in earthquakes:
        try:
            result = predict_earthquake(eq)
            process_prediction(
                result=result,
                phenomenon='earthquake',
                obj=eq,
                region=eq.place or 'Maroc',
                latitude=eq.latitude,
                longitude=eq.longitude,
            )
            count += 1
        except Exception as e:
            print(f"Erreur prédiction séisme {eq.id}: {e}")
    print(f"✅ {count} séismes prédits")
    return count


def run_flood_predictions():
    """Prédit pour toutes les inondations sans flood_risk."""
    floods = Flood.objects(flood_risk=None)
    count = 0
    for flood in floods:
        try:
            result = predict_flood(flood)
            process_prediction(
                result=result,
                phenomenon='flood',
                obj=flood,
                region=flood.region,
                latitude=flood.latitude,
                longitude=flood.longitude,
            )
            count += 1
        except Exception as e:
            print(f"Erreur prédiction inondation {flood.id}: {e}")
    print(f"✅ {count} inondations prédites")
    return count


def run_wildfire_predictions():
    """Prédit pour tous les incendies sans fire_risk."""
    wildfires = Wildfire.objects(fire_risk=None)
    count = 0
    for wf in wildfires:
        try:
            result = predict_wildfire(wf)
            process_prediction(
                result=result,
                phenomenon='wildfire',
                obj=wf,
                region='Maroc',
                latitude=wf.latitude,
                longitude=wf.longitude,
            )
            count += 1
        except Exception as e:
            print(f"Erreur prédiction incendie {wf.id}: {e}")
    print(f"✅ {count} incendies prédits")
    return count