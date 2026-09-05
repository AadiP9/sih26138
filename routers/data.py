import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models.db_models import Route, SessionLocal, Vessel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _vessel_to_dict(vessel: Vessel) -> dict:
    return {
        "id": vessel.id,
        "name": vessel.name,
        "vessel_type": vessel.vessel_type,
        "dwt": vessel.dwt,
        "engine_power_kw": vessel.engine_power_kw,
        "design_speed": vessel.design_speed,
        "speed_min": vessel.speed_min,
        "speed_max": vessel.speed_max,
        "fuel_options": json.loads(vessel.fuel_options),
    }


def _route_to_dict(route: Route) -> dict:
    return {
        "id": route.id,
        "name": route.name,
        "origin_port": route.origin_port,
        "dest_port": route.dest_port,
        "distance_nm": route.distance_nm,
        "typical_sea_state": route.typical_sea_state,
        "waypoints": json.loads(route.waypoints),
    }


@router.get("/vessels")
def list_vessels(db: Session = Depends(get_db)):
    return [_vessel_to_dict(v) for v in db.query(Vessel).all()]


@router.get("/routes")
def list_routes(db: Session = Depends(get_db)):
    return [_route_to_dict(r) for r in db.query(Route).all()]
