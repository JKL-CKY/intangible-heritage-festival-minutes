from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

from . import models, schemas, database
from .services import audio_service, openai_service, email_service

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="非物质文化遗产节策划会议系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/meetings/", response_model=schemas.Meeting)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)):
    db_meeting = models.Meeting(**meeting.dict(), created_at=datetime.utcnow())
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@app.get("/api/meetings/", response_model=List[schemas.Meeting])
def get_meetings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Meeting).offset(skip).limit(limit).all()

@app.get("/api/meetings/{meeting_id}", response_model=schemas.Meeting)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="会议不存在")
    return meeting

@app.post("/api/meetings/{meeting_id}/upload-audio")
async def upload_audio(meeting_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="会议不存在")
    
    file_path = os.path.join(UPLOAD_DIR, f"{meeting_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    meeting.audio_file = file_path
    db.commit()
    
    return {"message": "音频上传成功", "file_path": file_path}

@app.post("/api/meetings/{meeting_id}/process-audio")
def process_audio(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting or not meeting.audio_file:
        raise HTTPException(status_code=404, detail="会议或音频文件不存在")
    
    diarization = audio_service.perform_diarization(meeting.audio_file)
    transcription = audio_service.transcribe_audio(meeting.audio_file)
    
    segments = audio_service.create_transcription_segments(transcription, diarization)
    
    for seg in segments:
        db_segment = models.TranscriptionSegment(
            meeting_id=meeting_id,
            start_time=seg["start_time"],
            end_time=seg["end_time"],
            speaker=seg["speaker"],
            text=seg["text"],
            heritage_category=seg.get("heritage_category")
        )
        db.add(db_segment)
    
    meeting.transcription_completed = True
    db.commit()
    
    return {"message": "音频处理完成", "segments_count": len(segments)}

@app.get("/api/meetings/{meeting_id}/transcription", response_model=List[schemas.TranscriptionSegment])
def get_transcription(meeting_id: int, db: Session = Depends(get_db)):
    segments = db.query(models.TranscriptionSegment).filter(
        models.TranscriptionSegment.meeting_id == meeting_id
    ).order_by(models.TranscriptionSegment.start_time).all()
    return segments

@app.post("/api/meetings/{meeting_id}/generate-summary")
def generate_summary(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="会议不存在")
    
    segments = db.query(models.TranscriptionSegment).filter(
        models.TranscriptionSegment.meeting_id == meeting_id
    ).all()
    
    if not segments:
        raise HTTPException(status_code=400, detail="请先处理音频获取转写内容")
    
    full_transcript = "\n".join([f"[{s.speaker}]: {s.text}" for s in segments])
    
    summary = openai_service.generate_meeting_summary(full_transcript)
    flow_chart = openai_service.generate_activity_flowchart(full_transcript)
    promo_points = openai_service.generate_promotional_points(full_transcript)
    
    meeting.summary = summary
    meeting.activity_flowchart = flow_chart
    meeting.promotional_points = promo_points
    meeting.summary_generated = True
    db.commit()
    
    return {
        "summary": summary,
        "activity_flowchart": flow_chart,
        "promotional_points": promo_points
    }

@app.get("/api/artisans/", response_model=List[schemas.Artisan])
def get_artisans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Artisan).offset(skip).limit(limit).all()

@app.post("/api/artisans/", response_model=schemas.Artisan)
def create_artisan(artisan: schemas.ArtisanCreate, db: Session = Depends(get_db)):
    db_artisan = models.Artisan(**artisan.dict())
    db.add(db_artisan)
    db.commit()
    db.refresh(db_artisan)
    return db_artisan

@app.get("/api/booths/", response_model=List[schemas.Booth])
def get_booths(db: Session = Depends(get_db)):
    return db.query(models.Booth).all()

@app.post("/api/booths/", response_model=schemas.Booth)
def create_booth(booth: schemas.BoothCreate, db: Session = Depends(get_db)):
    db_booth = models.Booth(**booth.dict())
    db.add(db_booth)
    db.commit()
    db.refresh(db_booth)
    return db_booth

@app.post("/api/meetings/{meeting_id}/send-emails")
def send_emails(meeting_id: int, email_request: schemas.EmailRequest, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="会议不存在")
    
    if not meeting.summary_generated:
        raise HTTPException(status_code=400, detail="请先生成会议摘要")
    
    results = email_service.send_festival_emails(
        meeting=meeting,
        media_emails=email_request.media_emails,
        sponsor_emails=email_request.sponsor_emails
    )
    
    return {"message": "邮件发送完成", "results": results}

@app.get("/api/heritage-categories/")
def get_heritage_categories():
    categories = [
        {"id": 1, "name": "传统技艺", "description": "陶瓷、织造、锻造等传统手工技艺"},
        {"id": 2, "name": "传统音乐", "description": "民歌、器乐、戏曲音乐等"},
        {"id": 3, "name": "传统舞蹈", "description": "民族民间舞蹈、祭祀舞蹈等"},
        {"id": 4, "name": "传统戏剧", "description": "京剧、昆曲、地方戏等"},
        {"id": 5, "name": "传统曲艺", "description": "评书、相声、大鼓等"},
        {"id": 6, "name": "传统美术", "description": "剪纸、年画、刺绣等"},
        {"id": 7, "name": "传统医药", "description": "中医、民族医药等"},
        {"id": 8, "name": "民俗", "description": "传统节日、礼仪、节庆活动等"}
    ]
    return categories
