import os
import uuid
import asyncio
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

import resend
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient

from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ylrk")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
INQUIRY_RECIPIENT = os.environ.get("INQUIRY_RECIPIENT")

resend.api_key = RESEND_API_KEY

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="YLRK Beschriftungen API")
api = APIRouter(prefix="/api")


# ---------- Models ----------
class ChatMessage(BaseModel):
    id: Optional[str] = None
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str = "de"


class AdvancedChatRequest(BaseModel):
    prompt: str
    useHighThinking: bool = False


class ImageRequest(BaseModel):
    prompt: str
    aspectRatio: str = "16:9"
    mode: str = "standard"
    image: Optional[str] = None
    mimeType: Optional[str] = None


class InquiryRequest(BaseModel):
    type: str
    details: str = ""
    name: str
    email: str
    phone: str = ""
    company: str = ""
    contactPreference: str = "email"


# ---------- System prompts ----------
def chat_system_instruction(is_en: bool) -> str:
    if is_en:
        return (
            "You are a helpful AI assistant for YLRK Lettering (YLRK Beschriftungen), a premium "
            "sign-making and vehicle wrapping company in Switzerland. You answer questions about "
            "vehicle lettering, car wrapping, shop window wrapping, building signs, and textile printing. "
            "Be professional, friendly, and helpful. Always reply clearly in English.\n"
            "Approximate standard pricing:\n"
            "- Vehicle Lettering: from CHF 350\n"
            "- Car Wrapping (Vollfolierung): from CHF 2500\n"
            "- Shop Window Lettering: from CHF 150\n"
            "- Company Signs: from CHF 180\n"
            "- Textile Printing: from CHF 30 per piece (CHF 30-60)\n"
            "Recommend that the client request a personalized quote using the inquiry form on the main page, "
            "or via Phone/WhatsApp (+41 76 433 77 95)."
        )
    return (
        "Du bist ein hilfreicher KI-Assistent für YLRK Beschriftungen, ein erstklassiges Unternehmen für "
        "Werbetechnik in der Schweiz. Du beantwortest Fragen zu Fahrzeugbeschriftungen, Schaufensterbeklebung, "
        "Gebäudebeschriftung und Textildruck. Sei professionell, freundlich und hilfsbereit. Gib klare und "
        "präzise Antworten auf Deutsch.\n"
        "Die Richtpreise sind wie folgt:\n"
        "- Fahrzeugbeschriftung: ab CHF 350\n"
        "- Vollfolierung (Car Wrapping): ab CHF 2500\n"
        "- Schaufensterbeschriftung: ab CHF 150\n"
        "- Firmenschilder: ab CHF 180\n"
        "- Textildruck: CHF 30–60 pro Stück\n"
        "Empfehle dem Kunden, über das Kontaktformular auf der Hauptseite oder per Telefon/WhatsApp "
        "(+41 76 433 77 95) eine individuelle Offerte einzuholen."
    )


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"status": "ok", "service": "YLRK Beschriftungen API"}


@api.post("/chat")
async def chat(req: ChatRequest):
    is_en = req.language == "en"
    if not req.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    last_message = req.messages[-1].content
    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"ylrk-chat-{uuid.uuid4()}",
            system_message=chat_system_instruction(is_en),
        ).with_model("gemini", "gemini-3.5-flash")
        text = await chat_client.send_message(UserMessage(text=last_message))
        return {"text": text}
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Fehler bei der KI-Anfrage")


@api.post("/chat-advanced")
async def chat_advanced(req: AdvancedChatRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Bitte geben Sie eine Frage ein.")
    model = "gemini-3.1-pro-preview" if req.useHighThinking else "gemini-3.5-flash"
    system_msg = (
        "Du bist ein erstklassiger Schweizer Werbetechnik-Experte und Designberater. Nutze dein profundes "
        "Fachwissen, um hochkomplexe und strategisch durchdachte Beratung zur Fahrzeug- und "
        "Schaufensterbeschriftung bereitzustellen."
    )
    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"ylrk-advisor-{uuid.uuid4()}",
            system_message=system_msg,
        ).with_model("gemini", model)
        text = await chat_client.send_message(UserMessage(text=req.prompt))
        return {"text": text}
    except Exception as e:
        logger.error(f"Advanced chat error: {e}")
        raise HTTPException(status_code=500, detail="Fehler beim Verarbeiten der Anfrage.")


@api.post("/generate-image")
async def generate_image(req: ImageRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Bitte beschreiben Sie das gewünschte Design!")
    model = "gemini-3-pro-image-preview" if req.mode == "studio" else "gemini-3.1-flash-image-preview"
    prompt = (
        f"{req.prompt}. High quality, photorealistic, professional signage/vehicle-wrap visualization. "
        f"Composition aspect ratio approximately {req.aspectRatio}."
    )
    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"ylrk-image-{uuid.uuid4()}",
            system_message="You are a professional signage and vehicle-wrap design generator.",
        ).with_model("gemini", model).with_params(modalities=["image", "text"])

        if req.image:
            b64 = req.image.split(",")[1] if "," in req.image else req.image
            msg = UserMessage(
                text=(
                    f"Edit this image based on the following instruction: {req.prompt}. "
                    "Place lettering or print decals realistically and output the final updated photographic image."
                ),
                file_contents=[ImageContent(b64)],
            )
        else:
            msg = UserMessage(text=prompt)

        text, images = await chat_client.send_message_multimodal_response(msg)
        if images:
            img = images[0]
            return {"imageUrl": f"data:{img.get('mime_type', 'image/png')};base64,{img['data']}"}
        raise HTTPException(status_code=400, detail=text or "Kein Bild generiert.")
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        logger.error(f"Image generation error: {msg[:200]}")
        detail = "Fehler bei der Bildgenerierung."
        if any(k in msg for k in ["RESOURCE_EXHAUSTED", "quota", "429", "limit"]):
            detail = "KI-Limit erreicht. Bitte versuchen Sie es später erneut."
        raise HTTPException(status_code=500, detail=detail)


def build_inquiry_email(doc: dict) -> str:
    rows = [
        ("Art der Anfrage", doc.get("type", "-")),
        ("Name", doc.get("name", "-")),
        ("E-Mail", doc.get("email", "-")),
        ("Telefon", doc.get("phone") or "-"),
        ("Firma", doc.get("company") or "-"),
        ("Bevorzugter Kontakt", doc.get("contactPreference", "-")),
        ("Details", doc.get("details") or "-"),
        ("Eingegangen", doc.get("created_at", "-")),
    ]
    tr = "".join(
        f'<tr><td style="padding:8px 12px;font-weight:bold;color:#111;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top;">{k}</td>'
        f'<td style="padding:8px 12px;color:#333;border-bottom:1px solid #eee;">{v}</td></tr>'
        for k, v in rows
    )
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:24px;">
      <table style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
        <tr><td style="background:#0a0a0a;padding:20px 24px;">
          <span style="color:#fff;font-size:20px;font-weight:bold;letter-spacing:1px;">YLRK Beschriftungen</span><br/>
          <span style="color:#22d3ee;font-size:13px;">Neue Offerten-Anfrage</span>
        </td></tr>
        <tr><td style="padding:16px 24px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">{tr}</table>
        </td></tr>
        <tr><td style="padding:12px 24px;background:#fafafa;color:#999;font-size:12px;">
          Diese Nachricht wurde automatisch über das Kontaktformular auf ylrk-beschriftungen gesendet.
        </td></tr>
      </table>
    </div>
    """


async def send_inquiry_email(doc: dict):
    if not RESEND_API_KEY or not INQUIRY_RECIPIENT:
        logger.warning("Email not configured; skipping inquiry notification.")
        return
    params = {
        "from": f"YLRK Beschriftungen <{SENDER_EMAIL}>",
        "to": [INQUIRY_RECIPIENT],
        "reply_to": doc.get("email") or SENDER_EMAIL,
        "subject": f"Neue Offerten-Anfrage: {doc.get('type', 'Allgemein')} – {doc.get('name', '')}",
        "html": build_inquiry_email(doc),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Inquiry email sent: {result.get('id') if isinstance(result, dict) else result}")
    except Exception as e:
        logger.error(f"Failed to send inquiry email: {e}")


@api.post("/inquiries")
async def create_inquiry(req: InquiryRequest):
    doc = req.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.inquiries.insert_one({**doc})
    await send_inquiry_email(doc)
    return {"success": True, "id": doc["id"]}


@api.get("/inquiries")
async def list_inquiries():
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"inquiries": docs}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()
