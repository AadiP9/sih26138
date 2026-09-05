from pathlib import Path

from sqlalchemy import Column, Float, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'app.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Vessel(Base):
    __tablename__ = "vessels"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    vessel_type = Column(String, nullable=False)
    dwt = Column(Float, nullable=False)
    engine_power_kw = Column(Float, nullable=False)
    design_speed = Column(Float, nullable=False)
    speed_min = Column(Float, nullable=False)
    speed_max = Column(Float, nullable=False)
    fuel_options = Column(String, nullable=False)


class Route(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    origin_port = Column(String, nullable=False)
    dest_port = Column(String, nullable=False)
    distance_nm = Column(Float, nullable=False)
    typical_sea_state = Column(Integer, nullable=False)
    waypoints = Column(String, nullable=False)
