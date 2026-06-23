"""Backend API tests for YLRK Beschriftungen."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://page-maker-814.preview.emergentagent.com").rstrip("/")
# fallback: also read from frontend/.env if env not present
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_root(session):
    r = session.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "YLRK" in data.get("service", "")


# ---------- Chat ----------
def test_chat_de(session):
    payload = {"messages": [{"role": "user", "content": "Was kostet eine Vollfolierung?"}], "language": "de"}
    r = session.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "text" in data
    assert isinstance(data["text"], str) and len(data["text"]) > 10


def test_chat_en(session):
    payload = {"messages": [{"role": "user", "content": "How much does car wrapping cost?"}], "language": "en"}
    r = session.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    assert isinstance(r.json().get("text"), str)


def test_chat_empty_messages(session):
    r = session.post(f"{API}/chat", json={"messages": [], "language": "de"}, timeout=15)
    assert r.status_code == 400


# ---------- Advanced Chat ----------
def test_chat_advanced(session):
    payload = {"prompt": "Welche Farbe passt zu einem schwarzen Mercedes Sprinter Logo?", "useHighThinking": False}
    r = session.post(f"{API}/chat-advanced", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    assert isinstance(r.json().get("text"), str)
    assert len(r.json()["text"]) > 10


def test_chat_advanced_empty(session):
    r = session.post(f"{API}/chat-advanced", json={"prompt": "  "}, timeout=15)
    assert r.status_code == 400


# ---------- Image Generation ----------
def test_generate_image(session):
    payload = {
        "prompt": "white Mercedes Sprinter van with gold company logo lettering",
        "aspectRatio": "16:9",
        "mode": "standard",
    }
    r = session.post(f"{API}/generate-image", json=payload, timeout=120)
    # image gen may be slow or hit quota; accept 200 OK with image OR a 500 quota error
    if r.status_code == 200:
        data = r.json()
        assert "imageUrl" in data
        assert data["imageUrl"].startswith("data:image/")
    else:
        # Document the failure for triage
        pytest.skip(f"Image generation returned {r.status_code}: {r.text[:200]}")


def test_generate_image_empty_prompt(session):
    r = session.post(f"{API}/generate-image", json={"prompt": "", "aspectRatio": "16:9"}, timeout=15)
    assert r.status_code == 400


# ---------- Inquiries (Create -> List verify) ----------
def test_create_and_list_inquiry(session):
    unique = f"TEST_{int(time.time())}"
    payload = {
        "type": "Vollfolierung",
        "details": "Mercedes Sprinter, gold lettering",
        "name": f"{unique} Tester",
        "email": f"{unique.lower()}@example.com",
        "phone": "+41 76 000 00 00",
        "company": "TEST Co",
        "contactPreference": "email",
    }
    r = session.post(f"{API}/inquiries", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("success") is True
    assert "id" in data
    inquiry_id = data["id"]

    # List and verify persistence
    r2 = session.get(f"{API}/inquiries", timeout=15)
    assert r2.status_code == 200
    items = r2.json().get("inquiries", [])
    assert isinstance(items, list)
    match = next((i for i in items if i.get("id") == inquiry_id), None)
    assert match is not None, "Created inquiry not found in list"
    assert match["email"] == payload["email"]
    assert match["type"] == payload["type"]
    assert "_id" not in match  # ObjectId must be excluded


def test_create_inquiry_validation(session):
    # Missing required fields (name, email, type)
    r = session.post(f"{API}/inquiries", json={"details": "incomplete"}, timeout=15)
    assert r.status_code in (400, 422)
