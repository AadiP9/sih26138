FUEL_COST_PER_TONNE = {
    "HFO": 650,
    "LNG": 800,
    "Methanol": 1200,
    "Hydrogen": 5000,
    "Ammonia": 600,
}
CO2_PER_TONNE_FUEL = {
    "HFO": 3.114,
    "LNG": 2.75,
    "Methanol": 1.375,
    "Hydrogen": 0.0,
    "Ammonia": 0.0,
}
WTW_EMISSION_FACTOR = {
    "HFO": 91.0,
    "LNG": 70.0,
    "Methanol": 19.0,
    "Hydrogen": 3.0,
    "Ammonia": 0.5,
}
ENERGY_DENSITY_MJ = {
    "HFO": 40400,
    "LNG": 48600,
    "Methanol": 19900,
    "Hydrogen": 119900,
    "Ammonia": 18600,
}
IMO_2030_REDUCTION = 0.40
IMO_2050_REDUCTION = 1.00
HFO_BASELINE_FACTOR = 91.0

FUELS = ["HFO", "LNG", "Methanol", "Hydrogen", "Ammonia"]


def _cii_rating(eeoi: float) -> str:
    if eeoi < 3:
        return "A"
    if eeoi < 6:
        return "B"
    if eeoi < 10:
        return "C"
    if eeoi < 15:
        return "D"
    return "E"


def compare_fuels(
    vessel_type,
    dwt,
    speed,
    load_factor,
    sea_state,
    wind_speed,
    distance_nm,
    predictor_fn,
    shore_power=False,
):
    fuel_tonnes_hfo, _ = predictor_fn(
        vessel_type,
        dwt,
        speed,
        load_factor,
        sea_state,
        wind_speed,
        "HFO",
        distance_nm,
    )
    hfo_wtw = fuel_tonnes_hfo * WTW_EMISSION_FACTOR["HFO"]

    results = {}
    for fuel in FUELS:
        if fuel == "HFO":
            fuel_tonnes = fuel_tonnes_hfo
            co2_tonnes = fuel_tonnes * CO2_PER_TONNE_FUEL["HFO"]
        else:
            fuel_tonnes, co2_tonnes = predictor_fn(
                vessel_type,
                dwt,
                speed,
                load_factor,
                sea_state,
                wind_speed,
                fuel,
                distance_nm,
            )

        fuel_cost_usd = fuel_tonnes * FUEL_COST_PER_TONNE[fuel]
        wtw_emissions = fuel_tonnes * WTW_EMISSION_FACTOR[fuel]
        if shore_power:
            wtw_emissions *= 0.85
        energy_mj = fuel_tonnes * ENERGY_DENSITY_MJ[fuel]
        eeoi = (co2_tonnes * 1_000_000) / (dwt * load_factor * distance_nm)
        results[fuel] = {
            "fuel_type": fuel,
            "fuel_consumption_tonnes": float(fuel_tonnes),
            "fuel_cost_usd": float(fuel_cost_usd),
            "co2_equivalent_tonnes": float(co2_tonnes),
            "wtw_emissions_tonnes": float(wtw_emissions),
            "energy_mj": float(energy_mj),
            "eeoi": float(eeoi),
            "cii_rating": _cii_rating(eeoi),
            "imo2030_compliant": wtw_emissions <= hfo_wtw * (1 - IMO_2030_REDUCTION),
            "imo2050_compliant": wtw_emissions <= hfo_wtw * (1 - IMO_2050_REDUCTION),
        }
    return results
