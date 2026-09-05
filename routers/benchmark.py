from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from optimization.benchmark import run_benchmark
from routers.optimize import (
    build_fleet_problem,
    build_predictor_fn,
    get_db,
    load_vessels_and_routes,
)

router = APIRouter()


class BenchmarkRequest(BaseModel):
    vessel_ids: list[str]
    route_ids: list[str]
    cargo_demand: dict[str, float]
    emission_cap: float = 5000000.0
    budget_usd: float = 10000000.0
    weights: dict = Field(
        default_factory=lambda: {"cost": 0.4, "emissions": 0.4, "schedule": 0.2}
    )
    n_particles: int = 30
    max_iter: int = 100


@router.post("/benchmark")
def benchmark(payload: BenchmarkRequest, db: Session = Depends(get_db)):
    vessels, routes = load_vessels_and_routes(
        db, payload.vessel_ids, payload.route_ids
    )
    problem = build_fleet_problem(payload, vessels, routes)
    predictor_fn = build_predictor_fn(routes)
    return run_benchmark(
        problem,
        predictor_fn,
        n_particles=payload.n_particles,
        max_iter=payload.max_iter,
    )
