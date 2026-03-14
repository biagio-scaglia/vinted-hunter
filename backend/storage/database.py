from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import create_engine
import datetime

Base = declarative_base()

class Alert(Base):
    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    query = Column(String, nullable=False)
    keyword = Column(String)
    max_price = Column(Float)
    condition = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    found_items = relationship("FoundItem", back_populates="alert")

class FoundItem(Base):
    __tablename__ = 'found_items'
    id = Column(Integer, primary_key=True)
    alert_id = Column(Integer, ForeignKey('alerts.id'))
    vinted_id = Column(String, unique=True)
    title = Column(String)
    price = Column(String)
    link = Column(String)
    found_at = Column(DateTime, default=datetime.datetime.utcnow)
    alert = relationship("Alert", back_populates="found_items")

engine = create_engine('sqlite:///c:/Users/biagio.scaglia/Desktop/vinted/backend/vinted_hunter.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
