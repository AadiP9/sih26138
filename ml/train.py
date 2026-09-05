from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "fuel_data.csv"
MODEL_DIR = BASE_DIR / "saved_models"
MODEL_PATH = MODEL_DIR / "xgb_fuel_v1.pkl"
FEATURE_COLUMNS_PATH = MODEL_DIR / "feature_columns.pkl"

FEATURE_COLS = [
    "vessel_type",
    "dwt",
    "speed",
    "load_factor",
    "sea_state",
    "wind_speed",
    "fuel_type",
    "distance_nm",
]
TARGET_COL = "fuel_consumption_tonnes"


def train() -> None:
    df = pd.read_csv(DATA_PATH)
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL]

    X = pd.get_dummies(X, columns=["vessel_type", "fuel_type"])
    feature_columns = X.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        early_stopping_rounds=20,
        eval_metric="rmse",
    )
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    mae = mean_absolute_error(y_test, y_pred)

    print(f"R²: {r2:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(feature_columns, FEATURE_COLUMNS_PATH)
    print(f"Model saved to {MODEL_PATH}")
    print(f"Feature columns saved to {FEATURE_COLUMNS_PATH}")


if __name__ == "__main__":
    train()
