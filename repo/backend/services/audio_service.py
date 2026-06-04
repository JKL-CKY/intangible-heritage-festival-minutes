import os
from typing import List, Dict, Any
import whisper
from dotenv import load_dotenv

load_dotenv()

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "medium")
PYANNOTE_AUTH_TOKEN = os.getenv("PYANNOTE_AUTH_TOKEN", "")

_whisper_model = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        _whisper_model = whisper.load_model(WHISPER_MODEL)
    return _whisper_model

def transcribe_audio(audio_path: str) -> Dict[str, Any]:
    model = get_whisper_model()
    result = model.transcribe(
        audio_path,
        language="zh",
        task="transcribe",
        fp16=False
    )
    return result

def perform_diarization(audio_path: str) -> List[Dict[str, Any]]:
    diarization_result = []
    
    try:
        from pyannote.audio import Pipeline
        
        pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=PYANNOTE_AUTH_TOKEN
        )
        
        diarization = pipeline(audio_path)
        
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            diarization_result.append({
                "start": turn.start,
                "end": turn.end,
                "speaker": f"非遗传承人_{speaker}"
            })
            
    except Exception as e:
        print(f"Diarization error: {e}")
        diarization_result = [{
            "start": 0,
            "end": 3600,
            "speaker": "非遗传承人_01"
        }]
    
    return diarization_result

def create_transcription_segments(
    transcription: Dict[str, Any],
    diarization: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    segments = []
    
    for seg in transcription.get("segments", []):
        speaker = match_speaker(seg["start"], seg["end"], diarization)
        heritage_category = classify_heritage_category(seg["text"])
        
        segments.append({
            "start_time": seg["start"],
            "end_time": seg["end"],
            "speaker": speaker,
            "text": seg["text"].strip(),
            "heritage_category": heritage_category
        })
    
    return segments

def match_speaker(start: float, end: float, diarization: List[Dict[str, Any]]) -> str:
    mid_point = (start + end) / 2
    
    for d in diarization:
        if d["start"] <= mid_point <= d["end"]:
            return d["speaker"]
    
    return diarization[0]["speaker"] if diarization else "发言人"

def classify_heritage_category(text: str) -> str:
    keywords = {
        "传统技艺": ["陶瓷", "陶艺", "织造", "刺绣", "编织", "锻造", "木作", "木雕", "玉雕", "漆器"],
        "传统音乐": ["民歌", "唢呐", "二胡", "古筝", "琵琶", "戏曲", "唱腔"],
        "传统舞蹈": ["龙舞", "狮舞", "秧歌", "腰鼓", "花灯", "采茶舞"],
        "传统戏剧": ["京剧", "昆曲", "越剧", "黄梅戏", "豫剧", "川剧", "秦腔"],
        "传统曲艺": ["评书", "相声", "大鼓", "弹词", "快板", "二人转"],
        "传统美术": ["剪纸", "年画", "皮影", "泥塑", "面塑", "糖画"],
        "传统医药": ["中医", "针灸", "推拿", "中药", "火罐", "正骨"],
        "民俗": ["春节", "端午", "中秋", "清明", "庙会", "祭祀", "婚庆"]
    }
    
    for category, words in keywords.items():
        for word in words:
            if word in text:
                return category
    
    return "其他"
