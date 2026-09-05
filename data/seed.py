import json

from models.db_models import Base, Route, SessionLocal, Vessel, engine

VESSELS = [
    {
        "id": "v001",
        "name": "Pacific Star",
        "vessel_type": "container",
        "dwt": 65000,
        "engine_power_kw": 40000,
        "design_speed": 22,
        "speed_min": 12,
        "speed_max": 24,
        "fuel_options": ["HFO", "LNG"],
    },
    {
        "id": "v002",
        "name": "Atlantic Bulk",
        "vessel_type": "bulker",
        "dwt": 180000,
        "engine_power_kw": 18000,
        "design_speed": 14,
        "speed_min": 8,
        "speed_max": 16,
        "fuel_options": ["HFO", "LNG", "Methanol"],
    },
    {
        "id": "v003",
        "name": "Indian Pride",
        "vessel_type": "tanker",
        "dwt": 250000,
        "engine_power_kw": 30000,
        "design_speed": 16,
        "speed_min": 10,
        "speed_max": 18,
        "fuel_options": ["HFO"],
    },
    {
        "id": "v004",
        "name": "Nordic Carrier",
        "vessel_type": "roro",
        "dwt": 25000,
        "engine_power_kw": 22000,
        "design_speed": 20,
        "speed_min": 12,
        "speed_max": 22,
        "fuel_options": ["HFO", "Methanol"],
    },
    {
        "id": "v005",
        "name": "Green Pioneer",
        "vessel_type": "container",
        "dwt": 40000,
        "engine_power_kw": 25000,
        "design_speed": 20,
        "speed_min": 12,
        "speed_max": 22,
        "fuel_options": ["LNG", "Hydrogen"],
    },
    {
        "id": "v006",
        "name": "Ocean Titan",
        "vessel_type": "bulker",
        "dwt": 300000,
        "engine_power_kw": 22000,
        "design_speed": 13,
        "speed_min": 8,
        "speed_max": 15,
        "fuel_options": ["HFO", "Ammonia"],
    },
    {
        "id": "v007",
        "name": "Swift Trader",
        "vessel_type": "pctc",
        "dwt": 20000,
        "engine_power_kw": 15000,
        "design_speed": 19,
        "speed_min": 12,
        "speed_max": 21,
        "fuel_options": ["HFO", "LNG"],
    },
    {
        "id": "v008",
        "name": "Blue Horizon",
        "vessel_type": "container",
        "dwt": 90000,
        "engine_power_kw": 55000,
        "design_speed": 23,
        "speed_min": 14,
        "speed_max": 25,
        "fuel_options": ["HFO", "LNG", "Methanol"],
    },
    {
        "id": "v009",
        "name": "Eco Voyager",
        "vessel_type": "tanker",
        "dwt": 110000,
        "engine_power_kw": 20000,
        "design_speed": 15,
        "speed_min": 10,
        "speed_max": 17,
        "fuel_options": ["LNG", "Ammonia"],
    },
    {
        "id": "v010",
        "name": "Pacific Wind",
        "vessel_type": "roro",
        "dwt": 18000,
        "engine_power_kw": 12000,
        "design_speed": 18,
        "speed_min": 11,
        "speed_max": 20,
        "fuel_options": ["HFO", "Methanol"],
    },
]

ROUTES = [
    {
        "id": "r001",
        "name": "Singapore→Rotterdam",
        "origin_port": "Singapore",
        "dest_port": "Rotterdam",
        "distance_nm": 11000,
        "typical_sea_state": 4,
        "waypoints": [[1.3, 103.8], [51.9, 4.5]],
    },
    {
        "id": "r002",
        "name": "Shanghai→Los Angeles",
        "origin_port": "Shanghai",
        "dest_port": "Los Angeles",
        "distance_nm": 10000,
        "typical_sea_state": 5,
        "waypoints": [[31.2, 121.5], [33.7, -118.2]],
    },
    {
        "id": "r003",
        "name": "Mumbai→Colombo",
        "origin_port": "Mumbai",
        "dest_port": "Colombo",
        "distance_nm": 900,
        "typical_sea_state": 2,
        "waypoints": [[19.0, 72.8], [6.9, 79.8]],
    },
    {
        "id": "r004",
        "name": "Rotterdam→New York",
        "origin_port": "Rotterdam",
        "dest_port": "New York",
        "distance_nm": 3600,
        "typical_sea_state": 5,
        "waypoints": [[51.9, 4.5], [40.7, -74.0]],
    },
    {
        "id": "r005",
        "name": "Dubai→Singapore",
        "origin_port": "Dubai",
        "dest_port": "Singapore",
        "distance_nm": 3900,
        "typical_sea_state": 3,
        "waypoints": [[25.2, 55.3], [1.3, 103.8]],
    },
    {
        "id": "r006",
        "name": "Sydney→Tokyo",
        "origin_port": "Sydney",
        "dest_port": "Tokyo",
        "distance_nm": 4400,
        "typical_sea_state": 4,
        "waypoints": [[-33.8, 151.2], [35.6, 139.7]],
    },
    {
        "id": "r007",
        "name": "Houston→Rotterdam",
        "origin_port": "Houston",
        "dest_port": "Rotterdam",
        "distance_nm": 5400,
        "typical_sea_state": 4,
        "waypoints": [[29.7, -95.3], [51.9, 4.5]],
    },
    {
        "id": "r008",
        "name": "Cape Town→Mumbai",
        "origin_port": "Cape Town",
        "dest_port": "Mumbai",
        "distance_nm": 4700,
        "typical_sea_state": 3,
        "waypoints": [[-33.9, 18.4], [19.0, 72.8]],
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Vessel).count() == 0:
            db.add_all(
                [
                    Vessel(
                        id=row["id"],
                        name=row["name"],
                        vessel_type=row["vessel_type"],
                        dwt=row["dwt"],
                        engine_power_kw=row["engine_power_kw"],
                        design_speed=row["design_speed"],
                        speed_min=row["speed_min"],
                        speed_max=row["speed_max"],
                        fuel_options=json.dumps(row["fuel_options"]),
                    )
                    for row in VESSELS
                ]
            )
        if db.query(Route).count() == 0:
            db.add_all(
                [
                    Route(
                        id=row["id"],
                        name=row["name"],
                        origin_port=row["origin_port"],
                        dest_port=row["dest_port"],
                        distance_nm=row["distance_nm"],
                        typical_sea_state=row["typical_sea_state"],
                        waypoints=json.dumps(row["waypoints"]),
                    )
                    for row in ROUTES
                ]
            )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
