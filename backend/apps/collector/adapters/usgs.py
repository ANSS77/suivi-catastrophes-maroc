import requests
from datetime import datetime, timedelta
from apps.disasters.models import Earthquake

USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"

# Bounding box Maroc
MAROC_PARAMS = {
    "format": "geojson",
    "minlatitude": 20.5,
    "maxlatitude": 35.9,
    "minlongitude": -17.5,
    "maxlongitude": -1.0,
    "minmagnitude": 1.0,
    "orderby": "time",
    "limit": 100,
}


def fetch_earthquakes(days: int = 1) -> dict:
    result = {"created": 0, "skipped": 0, "errors": []}

    end_time   = datetime.utcnow()
    start_time = end_time - timedelta(days=days)

    params = MAROC_PARAMS.copy()
    params["starttime"] = start_time.strftime("%Y-%m-%d")
    params["endtime"]   = end_time.strftime("%Y-%m-%d")

    try:
        response = requests.get(USGS_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        result["errors"].append(f"Erreur requête USGS: {str(e)}")
        return result

    features = data.get("features", [])

    if not features:
        result["errors"].append("Aucun séisme trouvé")
        return result

    for feature in features:
        try:
            props    = feature.get("properties", {})
            geometry = feature.get("geometry", {})
            coords   = geometry.get("coordinates", [])

            longitude       = float(coords[0])
            latitude        = float(coords[1])
            depth           = float(coords[2])
            mag             = float(props.get("mag") or 0)
            mag_type        = props.get("magType", "")
            nst             = int(props.get("nst") or 0)
            gap             = float(props.get("gap") or 0)
            net             = props.get("net", "")
            eq_type         = props.get("type", "")
            location_source = props.get("locationSource", "")
            mag_source      = props.get("magSource", "")

            usgs_id    = feature.get("id", "")
            place      = props.get("place", "")
            time_ms    = props.get("time") or 0
            updated_ms = props.get("updated") or 0
            status     = props.get("status", "")
            dmin       = float(props.get("dmin") or 0)
            rms        = float(props.get("rms") or 0)

            eq_time      = datetime.utcfromtimestamp(time_ms / 1000)
            updated_time = datetime.utcfromtimestamp(updated_ms / 1000)

            Earthquake(
                # features modèle
                latitude=latitude,
                longitude=longitude,
                depth=depth,
                mag=mag,
                magType=mag_type,
                nst=nst,
                gap=gap,
                net=net,
                type=eq_type,
                locationSource=location_source,
                magSource=mag_source,
                usgs_id=usgs_id,
                place=place,
                time=eq_time,
                updated=updated_time,
                status=status,
                dmin=dmin,
                rms=rms,
                severity_label=None,
            ).save()

            result["created"] += 1

        except Exception as e:
            result["errors"].append(f"Feature ignorée: {str(e)}")
            result["skipped"] += 1
            continue

    return result
