import numpy as np
import pandas as pd

VESSEL_TYPES = ["tanker", "bulker", "container", "pctc", "roro"]
FUEL_TYPES = ["HFO", "LNG", "Methanol", "Hydrogen", "Ammonia"]
SFC = {
    "HFO": 190,
    "LNG": 165,
    "Methanol": 210,
    "Hydrogen": 130,
    "Ammonia": 250,
}


def generate_dataset(n_rows: int = 10000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    vessel_type = rng.choice(VESSEL_TYPES, size=n_rows)
    dwt = rng.uniform(5000, 300000, size=n_rows)
    speed = rng.uniform(5, 25, size=n_rows)
    load_factor = rng.uniform(0.1, 1.0, size=n_rows)
    sea_state = rng.integers(0, 13, size=n_rows)
    wind_speed = rng.uniform(0, 60, size=n_rows)
    fuel_type = rng.choice(FUEL_TYPES, size=n_rows)
    distance_nm = rng.uniform(500, 15000, size=n_rows)

    sfc = np.array([SFC[ft] for ft in fuel_type])
    engine_power_kw = (dwt ** 0.667) * (speed ** 3) / 150
    fuel_rate_tonnes_per_hour = (engine_power_kw * sfc) / 1_000_000
    voyage_hours = distance_nm / speed
    raw_consumption = fuel_rate_tonnes_per_hour * voyage_hours

    sea_correction = np.where(sea_state > 3, 1 + 0.08 * (sea_state - 3), 1.0)
    consumption = raw_consumption * sea_correction
    consumption = consumption * (0.7 + 0.3 * load_factor)
    consumption = consumption * (1 + rng.normal(0, 0.05, size=n_rows))
    consumption = np.maximum(consumption, 0)

    return pd.DataFrame(
        {
            "vessel_type": vessel_type,
            "dwt": dwt,
            "speed": speed,
            "load_factor": load_factor,
            "sea_state": sea_state,
            "wind_speed": wind_speed,
            "fuel_type": fuel_type,
            "distance_nm": distance_nm,
            "fuel_consumption_tonnes": consumption,
        }
    )


if __name__ == "__main__":
    df = generate_dataset(10000)
    df.to_csv("ml/fuel_data.csv", index=False)
    print(f"Dataset generated: {df.shape}")
    print(df.head())
    print(df.describe())
