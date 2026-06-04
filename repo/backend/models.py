from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    meeting_date = Column(DateTime)
    location = Column(String(255))
    audio_file = Column(String(500))
    transcription_completed = Column(Boolean, default=False)
    summary_generated = Column(Boolean, default=False)
    summary = Column(Text)
    activity_flowchart = Column(Text)
    promotional_points = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    segments = relationship("TranscriptionSegment", back_populates="meeting")

class TranscriptionSegment(Base):
    __tablename__ = "transcription_segments"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    start_time = Column(Float)
    end_time = Column(Float)
    speaker = Column(String(100))
    text = Column(Text)
    heritage_category = Column(String(100))
    
    meeting = relationship("Meeting", back_populates="segments")

class Artisan(Base):
    __tablename__ = "artisans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    heritage_category = Column(String(100))
    description = Column(Text)
    portrait_url = Column(String(500))
    contact_info = Column(String(255))
    heritage_level = Column(String(50))
    years_of_experience = Column(Integer)

class Booth(Base):
    __tablename__ = "booths"
    
    id = Column(Integer, primary_key=True, index=True)
    booth_number = Column(String(50), nullable=False)
    name = Column(String(200), nullable=False)
    heritage_category = Column(String(100))
    artisan_id = Column(Integer, ForeignKey("artisans.id"))
    location_x = Column(Float)
    location_y = Column(Float)
    width = Column(Float, default=100)
    height = Column(Float, default=100)
    description = Column(Text)
    image_url = Column(String(500))

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255), nullable=False)
    type = Column(String(50))
    organization = Column(String(200))
