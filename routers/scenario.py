from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

from analysis.scenarios import CO2_PER_TONNE_FUEL, compare_fuels

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "saved_models" / "xgb_fuel_v1.pkl"
FEATURE_COLUMNS_PATH = BASE_DIR / "ml" / "saved_models" / "feature_columns.pkl"

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_COLUMNS_PATH)

router = APIRouter()


class ScenarioRequest(BaseModel):
    vessel_type: str
    dwt: float
    speed: float
    load_factor: float = 0.8
    sea_state: int = 3
    wind_speed: float = 15.0
    distance_nm: float
    shore_power: bool = False


def predictor_fn(
    vessel_type,
    dwt,
    speed,
    load_factor,
    sea_state,
    wind_speed,
    fuel_type,
    distance_nm,
):
    row = pd.DataFrame(
        [
            {
                "vessel_type": vessel_type,
                "dwt": dwt,
                "speed": speed,
                "load_factor": load_factor,
                "sea_state": sea_state,
                "wind_speed": wind_speed,
                "fuel_type": fuel_type,
                "distance_nm": distance_nm,
            }
        ]
    )
    encoded = pd.get_dummies(row, columns=["vessel_type", "fuel_type"])
    encoded = encoded.reindex(columns=feature_columns, fill_value=0)
    fuel_tonnes = float(model.predict(encoded)[0])
    co2_tonnes = fuel_tonnes * CO2_PER_TONNE_FUEL[fuel_type]
    return float(fuel_tonnes), float(co2_tonnes)


@router.post("/scenario")
def scenario(payload: ScenarioRequest):
    comparison = compare_fuels(
        payload.vessel_type,
        payload.dwt,
        payload.speed,
        payload.load_factor,
        payload.sea_state,
        payload.wind_speed,
        payload.distance_nm,
        predictor_fn,
        shore_power=payload.shore_power,
    )
    return {
        "results": list(comparison.values()),
        "shore_power_enabled": payload.shore_power,
    }
