import time

from optimization.pso import PSO
from optimization.qpso import QPSO


def run_benchmark(problem, predictor_fn, n_particles=30, max_iter=100):
    qpso = QPSO(n_particles=n_particles, max_iter=max_iter)
    start = time.perf_counter()
    qpso_result = qpso.optimize(problem, predictor_fn)
    qpso_time = time.perf_counter() - start

    pso = PSO(n_particles=n_particles, max_iter=max_iter)
    start = time.perf_counter()
    pso_result = pso.optimize(problem, predictor_fn)
    pso_time = time.perf_counter() - start

    qpso_fitness = qpso_result["best_fitness"]
    pso_fitness = pso_result["best_fitness"]
    winner = "QPSO" if qpso_fitness <= pso_fitness else "PSO"
    qpso_speedup = round(pso_time / qpso_time, 2) if qpso_time > 0 else 0.0
    if pso_fitness != 0:
        qpso_improvement_pct = round(
            (pso_fitness - qpso_fitness) / pso_fitness * 100, 2
        )
    else:
        qpso_improvement_pct = 0.0

    return {
        "QPSO": {
            "best_fitness": qpso_fitness,
            "computation_time_s": qpso_time,
            "convergence_log": qpso_result["convergence_log"],
            "best_solution": qpso_result["best_solution"],
            "iterations": qpso_result["iterations"],
        },
        "PSO": {
            "best_fitness": pso_fitness,
            "computation_time_s": pso_time,
            "convergence_log": pso_result["convergence_log"],
            "best_solution": pso_result["best_solution"],
            "iterations": pso_result["iterations"],
        },
        "winner": winner,
        "qpso_speedup": qpso_speedup,
        "qpso_improvement_pct": qpso_improvement_pct,
    }
