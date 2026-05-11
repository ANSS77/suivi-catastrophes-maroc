import requests
from datetime import datetime, date
from django.conf import settings
from apps.disasters.models import Wildfire

# Bounding box Maroc (avec Sahara)
MAROC_BBOX = "-17.5,20.5,-1.0,35.9"  # min_lon, min_lat, max_lon, max_lat

FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"

# NASA FIRMS VIIRS retourne confidence en texte ou en entier
CONFIDENCE_MAP = {
    'l': 25,    # low
    'n': 50,    # nominal
    'h': 75,    # high
}


def parse_confidence(value: str) -> int:
    """Convertit confidence VIIRS (l/n/h ou entier) en int."""
    value = str(value).strip().lower()
    if value in CONFIDENCE_MAP:
        return CONFIDENCE_MAP[value]
    try:
        return int(float(value))
    except ValueError:
        return 50  # valeur par défaut : nominal


def fetch_wildfires(days: int = 1) -> dict:
    api_key = settings.NASA_FIRMS_API_KEY
    days = min(days, 5)
    url = f"{FIRMS_BASE_URL}/{api_key}/VIIRS_SNPP_NRT/{MAROC_BBOX}/{days}"

    result = {"created": 0, "skipped": 0, "errors": []}

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        result["errors"].append(f"Erreur requête FIRMS: {str(e)}")
        return result

    lines = response.text.strip().split("\n")

    if len(lines) <= 1:
        result["errors"].append("Aucune donnée retournée par FIRMS")
        return result

    headers = lines[0].split(",")

    for line in lines[1:]:
        try:
            values = line.split(",")
            row = dict(zip(headers, values))

            latitude   = float(row.get("latitude", 0))
            longitude  = float(row.get("longitude", 0))
            bright_ti4 = float(row.get("bright_ti4", 0))
            bright_ti5 = float(row.get("bright_ti5", 0))
            scan       = float(row.get("scan", 0))
            track      = float(row.get("track", 0))
            confidence = parse_confidence(row.get("confidence", "n"))  # ← CORRIGÉ
            daynight   = row.get("daynight", "D").strip()
            type_      = int(float(row.get("type", 0)))
            acq_date   = row.get("acq_date", str(date.today())).strip()

            parsed_date  = datetime.strptime(acq_date, "%Y-%m-%d")
            month        = parsed_date.month
            day_of_year  = parsed_date.timetuple().tm_yday
            daynight_enc = 1 if daynight == "D" else 0

            Wildfire(
                latitude=latitude,
                longitude=longitude,
                bright_ti4=bright_ti4,
                bright_ti5=bright_ti5,
                scan=scan,
                track=track,
                confidence=confidence,
                daynight=daynight,
                daynight_enc=daynight_enc,
                type=type_,
                acq_date=parsed_date,
                month=month,
                day_of_year=day_of_year,
                fire_risk=None,
            ).save()

            result["created"] += 1

        except Exception as e:
            result["errors"].append(f"Ligne ignorée: {str(e)}")
            result["skipped"] += 1
            continue

    return result