from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String

from data.seed import seed
from models.db_models import Base, SessionLocal, engine
from routers.benchmark import router as benchmark_router
from routers.data import router as data_router
from routers.optimize import router as optimize_router
from routers.predict import router as predict_router
from routers.scenario import router as scenario_router

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)


class HealthCheck(Base):
    __tablename__ = "health_checks"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, nullable=False, default="ok")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed()
    yield


app = FastAPI(title="sih26138", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
app.include_router(data_router, prefix="/api")
app.include_router(optimize_router, prefix="/api")
app.include_router(benchmark_router, prefix="/api")
app.include_router(scenario_router, prefix="/api")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
