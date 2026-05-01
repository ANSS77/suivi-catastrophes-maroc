import requests
from datetime import datetime, timedelta, timezone
from apps.disasters.models import Flood

NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

REGIONS = [
    {"name": "Tanger-Tétouan-Al Hoceïma", "latitude": 35.5, "longitude": -5.3},
    {"name": "Oriental",                   "latitude": 34.7, "longitude": -2.0},
    {"name": "Fès-Meknès",                 "latitude": 33.9, "longitude": -5.0},
    {"name": "Rabat-Salé-Kénitra",         "latitude": 34.0, "longitude": -6.8},
    {"name": "Béni Mellal-Khénifra",       "latitude": 32.3, "longitude": -6.3},
    {"name": "Casablanca-Settat",          "latitude": 33.6, "longitude": -7.6},
    {"name": "Marrakech-Safi",             "latitude": 31.6, "longitude": -8.0},
    {"name": "Drâa-Tafilalet",             "latitude": 31.0, "longitude": -4.0},
    {"name": "Souss-Massa",                "latitude": 30.4, "longitude": -9.6},
    {"name": "Guelmim-Oued Noun",          "latitude": 28.9, "longitude": -10.1},
    {"name": "Laâyoune-Sakia El Hamra",    "latitude": 27.1, "longitude": -13.2},
    {"name": "Dakhla-Oued Ed-Dahab",       "latitude": 23.7, "longitude": -15.9},
]


def fetch_floods(days: int = 1) -> dict:
    result = {"created": 0, "skipped": 0, "errors": []}

    end_date   = datetime.now(timezone.utc) - timedelta(days=7)
    start_date = end_date - timedelta(days=days)

    start_str = start_date.strftime("%Y%m%d")
    end_str   = end_date.strftime("%Y%m%d")

    for region in REGIONS:
        try:
            params = {
                "parameters": "PRECTOTCORR,RH2M,T2M,WS2M,GWETTOP,PS",
                "community": "RE",
                "longitude": region["longitude"],
                "latitude": region["latitude"],
                "start": start_str,
                "end": end_str,
                "format": "JSON",
            }

            response = requests.get(NASA_POWER_URL, params=params, timeout=60)
            response.raise_for_status()
            data = response.json()

            properties = data.get("properties", {}).get("parameter", {})
            prec_data = properties.get("PRECTOTCORR", {})
            rh2m_data = properties.get("RH2M", {})
            t2m_data  = properties.get("T2M", {})
            ws2m_data = properties.get("WS2M", {})
            gwet_data = properties.get("GWETTOP", {})
            ps_data   = properties.get("PS", {})

            for date_str, prec_value in prec_data.items():
                try:
                    parsed_date = datetime.strptime(date_str, "%Y%m%d")

                    prectotcorr = float(prec_value or 0)
                    rh2m        = float(rh2m_data.get(date_str) or 0)
                    t2m         = float(t2m_data.get(date_str) or 0)
                    ws2m        = float(ws2m_data.get(date_str) or 0)
                    gwettop     = float(gwet_data.get(date_str) or 0)
                    ps          = float(ps_data.get(date_str) or 0)

                    if any(v == -999 for v in [prectotcorr, rh2m, t2m, ws2m, gwettop, ps]):
                        result["skipped"] += 1
                        continue

                    month       = parsed_date.month
                    day_of_year = parsed_date.timetuple().tm_yday

                    Flood(
                        PRECTOTCORR=prectotcorr,
                        RH2M=rh2m,
                        T2M=t2m,
                        WS2M=ws2m,
                        GWETTOP=gwettop,
                        PS=ps,
                        region=region["name"],
                        latitude=region["latitude"],
                        longitude=region["longitude"],
                        date=parsed_date,
                        month=month,
                        day_of_year=day_of_year,
                        flood_risk=None,
                    ).save()

                    result["created"] += 1

                except Exception as e:
                    result["errors"].append(f"Date {date_str} ignorée: {str(e)}")
                    result["skipped"] += 1
                    continue

        except Exception as e:
            result["errors"].append(f"Région {region['name']} ignorée: {str(e)}")
            result["skipped"] += 1
            continue

    return result