import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
from dotenv import load_dotenv
from .openai_service import generate_media_email_content, generate_sponsor_email_content

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_email(to_email: str, subject: str, body: str) -> Dict[str, Any]:
    result = {"success": False, "email": to_email, "error": None}
    
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject
        
        msg.attach(MIMEText(body, "plain", "utf-8"))
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        result["success"] = True
    except Exception as e:
        result["error"] = str(e)
    
    return result

def send_festival_emails(
    meeting,
    media_emails: List[str] = None,
    sponsor_emails: List[str] = None
) -> Dict[str, List[Dict[str, Any]]]:
    media_emails = media_emails or []
    sponsor_emails = sponsor_emails or []
    
    results = {
        "media": [],
        "sponsor": []
    }
    
    media_content = generate_media_email_content(meeting)
    sponsor_content = generate_sponsor_email_content(meeting)
    
    for email in media_emails:
        result = send_email(email, media_content["subject"], media_content["body"])
        results["media"].append(result)
    
    for email in sponsor_emails:
        result = send_email(email, sponsor_content["subject"], sponsor_content["body"])
        results["sponsor"].append(result)
    
    return results
