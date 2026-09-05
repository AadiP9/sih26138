import json
from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.db_models import Route, SessionLocal, Vessel
from optimization.qpso import FleetProblem, QPSO

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "saved_models" / "xgb_fuel_v1.pkl"
FEATURE_COLUMNS_PATH = BASE_DIR / "ml" / "saved_models" / "feature_columns.pkl"

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_COLUMNS_PATH)

CO2_PER_TONNE_FUEL = {
    "HFO": 3.114,
    "LNG": 2.75,
    "Methanol": 1.375,
    "Hydrogen": 0.0,
    "Ammonia": 0.0,
}

router = APIRouter()


class OptimizeRequest(BaseModel):
    vessel_ids: list[str]
    route_ids: list[str]
    cargo_demand: dict[str, float]
    emission_cap: float
    budget_usd: float
    weights: dict[str, float]
    n_particles: int = 50
    max_iter: int = 200


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def vessel_to_dict(vessel: Vessel) -> dict:
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


def route_to_dict(route: Route) -> dict:
    return {
        "id": route.id,
        "name": route.name,
        "origin_port": route.origin_port,
        "dest_port": route.dest_port,
        "distance_nm": route.distance_nm,
        "typical_sea_state": route.typical_sea_state,
        "waypoints": json.loads(route.waypoints),
    }


def load_vessels_and_routes(db: Session, vessel_ids: list[str], route_ids: list[str]):
    vessel_rows = db.query(Vessel).filter(Vessel.id.in_(vessel_ids)).all()
    route_rows = db.query(Route).filter(Route.id.in_(route_ids)).all()
    vessels_by_id = {v.id: vessel_to_dict(v) for v in vessel_rows}
    routes_by_id = {r.id: route_to_dict(r) for r in route_rows}

    missing_vessels = [vid for vid in vessel_ids if vid not in vessels_by_id]
    missing_routes = [rid for rid in route_ids if rid not in routes_by_id]
    if missing_vessels or missing_routes:
        raise HTTPException(
            status_code=404,
            detail={
                "missing_vessels": missing_vessels,
                "missing_routes": missing_routes,
            },
        )

    vessels = [vessels_by_id[vid] for vid in vessel_ids]
    routes = [routes_by_id[rid] for rid in route_ids]
    return vessels, routes


def build_predictor_fn(routes: list):
    routes_by_id = {r["id"]: r for r in routes}

    def predictor_fn(vessel_dict, assignment_dict):
        route = routes_by_id[assignment_dict["route_id"]]
        row = pd.DataFrame(
            [
                {
                    "vessel_type": vessel_dict["vessel_type"],
                    "dwt": vessel_dict["dwt"],
                    "speed": assignment_dict["speed"],
                    "load_factor": 0.8,
                    "sea_state": route["typical_sea_state"],
                    "wind_speed": 15.0,
                    "fuel_type": assignment_dict["fuel_type"],
                    "distance_nm": route["distance_nm"],
                }
            ]
        )
        encoded = pd.get_dummies(row, columns=["vessel_type", "fuel_type"])
        encoded = encoded.reindex(columns=feature_columns, fill_value=0)
        fuel_tonnes = float(model.predict(encoded)[0])
        fuel_type = assignment_dict["fuel_type"]
        co2_tonnes = fuel_tonnes * CO2_PER_TONNE_FUEL[fuel_type]
        return float(fuel_tonnes), float(co2_tonnes)

    return predictor_fn


def build_fleet_problem(payload, vessels: list, routes: list) -> FleetProblem:
    return FleetProblem(
        vessels=vessels,
        routes=routes,
        cargo_demand=payload.cargo_demand,
        emission_cap=payload.emission_cap,
        budget_usd=payload.budget_usd,
        weights=payload.weights,
    )


@router.post("/optimize")
def optimize(payload: OptimizeRequest, db: Session = Depends(get_db)):
    vessels, routes = load_vessels_and_routes(
        db, payload.vessel_ids, payload.route_ids
    )
    problem = build_fleet_problem(payload, vessels, routes)
    predictor_fn = build_predictor_fn(routes)
    optimizer = QPSO(n_particles=payload.n_particles, max_iter=payload.max_iter)
    return optimizer.optimize(problem, predictor_fn)
