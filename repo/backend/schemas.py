from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_date: Optional[datetime] = None
    location: Optional[str] = None

class MeetingCreate(MeetingBase):
    pass

class Meeting(MeetingBase):
    id: int
    audio_file: Optional[str] = None
    transcription_completed: bool = False
    summary_generated: bool = False
    summary: Optional[str] = None
    activity_flowchart: Optional[str] = None
    promotional_points: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TranscriptionSegmentBase(BaseModel):
    meeting_id: int
    start_time: float
    end_time: float
    speaker: str
    text: str
    heritage_category: Optional[str] = None

class TranscriptionSegmentCreate(TranscriptionSegmentBase):
    pass

class TranscriptionSegment(TranscriptionSegmentBase):
    id: int
    
    class Config:
        from_attributes = True

class ArtisanBase(BaseModel):
    name: str
    heritage_category: Optional[str] = None
    description: Optional[str] = None
    portrait_url: Optional[str] = None
    contact_info: Optional[str] = None
    heritage_level: Optional[str] = None
    years_of_experience: Optional[int] = None

class ArtisanCreate(ArtisanBase):
    pass

class Artisan(ArtisanBase):
    id: int
    
    class Config:
        from_attributes = True

class BoothBase(BaseModel):
    booth_number: str
    name: str
    heritage_category: Optional[str] = None
    artisan_id: Optional[int] = None
    location_x: Optional[float] = None
    location_y: Optional[float] = None
    width: Optional[float] = 100
    height: Optional[float] = 100
    description: Optional[str] = None
    image_url: Optional[str] = None

class BoothCreate(BoothBase):
    pass

class Booth(BoothBase):
    id: int
    
    class Config:
        from_attributes = True

class EmailRequest(BaseModel):
    media_emails: List[EmailStr] = []
    sponsor_emails: List[EmailStr] = []
