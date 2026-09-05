import uuid
from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "saved_models" / "xgb_fuel_v1.pkl"
FEATURE_COLUMNS_PATH = BASE_DIR / "ml" / "saved_models" / "feature_columns.pkl"

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_COLUMNS_PATH)

CO2_FACTORS = {
    "HFO": 3.114,
    "LNG": 2.75,
    "Methanol": 1.375,
    "Hydrogen": 0.0,
    "Ammonia": 0.0,
}

router = APIRouter()


class PredictRequest(BaseModel):
    vessel_type: str
    dwt: float
    speed: float
    load_factor: float
    sea_state: int
    wind_speed: float
    fuel_type: str
    distance_nm: float


class PredictResponse(BaseModel):
    fuel_consumption_tonnes: float
    co2_equivalent_tonnes: float
    eeoi: float
    result_id: str


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    row = pd.DataFrame([payload.model_dump()])
    encoded = pd.get_dummies(row, columns=["vessel_type", "fuel_type"])
    encoded = encoded.reindex(columns=feature_columns, fill_value=0)

    fuel_consumption_tonnes = float(model.predict(encoded)[0])
    co2_equivalent_tonnes = fuel_consumption_tonnes * CO2_FACTORS[payload.fuel_type]
    eeoi = (co2_equivalent_tonnes * 1_000_000) / (
        payload.dwt * payload.load_factor * payload.distance_nm
    )

    return PredictResponse(
        fuel_consumption_tonnes=fuel_consumption_tonnes,
        co2_equivalent_tonnes=co2_equivalent_tonnes,
        eeoi=eeoi,
        result_id=str(uuid.uuid4()),
    )
