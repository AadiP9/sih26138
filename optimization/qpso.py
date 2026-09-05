import dataclasses
import itertools  # noqa: F401
import time  # noqa: F401
import uuid

import numpy as np

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
FUELS = ["HFO", "LNG", "Methanol", "Hydrogen", "Ammonia"]

REF_SCHEDULE = 500.0


@dataclasses.dataclass
class FleetProblem:
    vessels: list
    routes: list
    cargo_demand: dict
    emission_cap: float
    budget_usd: float
    weights: dict


class QPSO:
    def __init__(self, n_particles=50, max_iter=200, beta_start=1.0, beta_end=0.5):
        self.n_particles = n_particles
        self.max_iter = max_iter
        self.beta_start = beta_start
        self.beta_end = beta_end

    def encode(self, problem):
        n_v = len(problem.vessels)
        return np.random.uniform(0, 1, size=(self.n_particles, n_v * 3))

    def decode(self, particle, problem):
        n_v = len(problem.vessels)
        n_routes = len(problem.routes)
        assignments = []
        for i, vessel in enumerate(problem.vessels):
            speed_min = vessel["speed_min"]
            speed_max = vessel["speed_max"]
            speed = speed_min + particle[i] * (speed_max - speed_min)

            available_fuels = vessel["fuel_options"]
            n_fuels = max(len(available_fuels), 1)
            fuel_idx = int(particle[n_v + i] * n_fuels)
            fuel_idx = min(max(fuel_idx, 0), n_fuels - 1)
            fuel_type = available_fuels[fuel_idx] if available_fuels else FUELS[0]

            route_idx = int(particle[2 * n_v + i] * n_routes)
            route_idx = min(max(route_idx, 0), max(n_routes - 1, 0))
            route_id = problem.routes[route_idx]["id"]

            assignments.append(
                {
                    "vessel_id": vessel["id"],
                    "speed": float(speed),
                    "fuel_type": fuel_type,
                    "route_id": route_id,
                }
            )
        return assignments

    def evaluate(self, particle, problem, predictor_fn, penalty_lambda):
        assignments = self.decode(particle, problem)
        vessel_by_id = {v["id"]: v for v in problem.vessels}
        route_by_id = {r["id"]: r for r in problem.routes}

        total_cost = 0.0
        total_emissions = 0.0
        total_schedule_dev = 0.0

        for assignment in assignments:
            vessel = vessel_by_id[assignment["vessel_id"]]
            route = route_by_id[assignment["route_id"]]
            fuel_tonnes, co2_tonnes = predictor_fn(vessel, assignment)
            fuel_cost = fuel_tonnes * FUEL_COST_PER_TONNE[assignment["fuel_type"]]
            distance_nm = route["distance_nm"]
            speed = max(assignment["speed"], 1e-6)
            design_speed = max(vessel["design_speed"], 1e-6)
            schedule_dev = abs(distance_nm / speed - distance_nm / design_speed)

            total_cost += fuel_cost
            total_emissions += co2_tonnes
            total_schedule_dev += schedule_dev

        ref_cost = max(problem.budget_usd, 1e-10)
        ref_emissions = max(problem.emission_cap, 1e-10)
        norm_cost = total_cost / ref_cost
        norm_emissions = total_emissions / ref_emissions
        norm_schedule = total_schedule_dev / REF_SCHEDULE

        w = problem.weights
        weighted_fitness = (
            w["cost"] * norm_cost
            + w["emissions"] * norm_emissions
            + w["schedule"] * norm_schedule
        )

        g1 = max(0.0, total_emissions - problem.emission_cap)
        g2 = max(0.0, total_cost - problem.budget_usd)
        penalty = penalty_lambda * (g1**2 + g2**2)
        fitness = weighted_fitness + penalty

        details = {
            "total_cost": total_cost,
            "total_emissions": total_emissions,
            "total_schedule_dev": total_schedule_dev,
            "assignments": assignments,
        }
        return fitness, details

    def is_dominated(self, a, b):
        objectives = ("cost", "emissions", "schedule")
        b_le_all = all(b[k] <= a[k] for k in objectives)
        b_lt_one = any(b[k] < a[k] for k in objectives)
        return b_le_all and b_lt_one

    def update_pareto(self, pareto_front, candidate):
        pareto_front = [s for s in pareto_front if not self.is_dominated(s, candidate)]
        if not any(self.is_dominated(candidate, s) for s in pareto_front):
            pareto_front.append(candidate)
        return pareto_front

    def optimize(self, problem, predictor_fn):
        positions = self.encode(problem)
        pbest = positions.copy()
        pbest_fitness = np.full(self.n_particles, np.inf)
        gbest_position = None
        gbest_fitness = np.inf
        convergence_log = []
        pareto_front = []
        penalty_lambda = 1.0

        for iteration in range(self.max_iter):
            beta = self.beta_start - (self.beta_start - self.beta_end) * (
                iteration / self.max_iter
            )
            if iteration > 0 and iteration % 50 == 0:
                penalty_lambda *= 10

            for i in range(self.n_particles):
                fitness, details = self.evaluate(
                    positions[i], problem, predictor_fn, penalty_lambda
                )
                if fitness < pbest_fitness[i]:
                    pbest[i] = positions[i].copy()
                    pbest_fitness[i] = fitness
                if fitness < gbest_fitness:
                    gbest_position = positions[i].copy()
                    gbest_fitness = fitness
                candidate = {
                    "cost": details["total_cost"],
                    "emissions": details["total_emissions"],
                    "schedule": details["total_schedule_dev"],
                    "solution": details["assignments"],
                }
                pareto_front = self.update_pareto(pareto_front, candidate)

            mbest = np.mean(pbest, axis=0)
            for i in range(self.n_particles):
                phi = np.random.uniform(0, 1, size=positions[i].shape)
                p = phi * pbest[i] + (1 - phi) * gbest_position
                u = np.random.uniform(0, 1, size=positions[i].shape)
                sign = np.random.choice([-1.0, 1.0], size=positions[i].shape)
                positions[i] = p + sign * beta * np.abs(mbest - positions[i]) * np.log(
                    1.0 / (u + 1e-10)
                )
                positions[i] = np.clip(positions[i], 0.0, 1.0)

            convergence_log.append(float(gbest_fitness))

        return {
            "run_id": str(uuid.uuid4()),
            "best_fitness": float(gbest_fitness),
            "best_solution": self.decode(gbest_position, problem),
            "pareto_front": pareto_front,
            "convergence_log": convergence_log,
            "iterations": self.max_iter,
        }
