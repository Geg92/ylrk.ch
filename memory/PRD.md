# YLRK Beschriftungen — PRD

## Original Problem Statement
User uploaded a Google AI Studio export (Vite + React 19 + Express + Tailwind v4) for "YLRK Beschriftungen", a bilingual (DE/EN) Swiss vehicle-wrapping / signage marketing website, and asked: "Diese website erstellen" — make it look good and work.

## Architecture (adapted to Emergent)
- **Frontend**: Vite + React 19 + TypeScript + Tailwind v4, served on port 3000 (`yarn start` → `vite`). `/app/frontend`.
- **Backend**: FastAPI on port 8001 (`/app/backend/server.py`). Frontend calls relative `/api/*` which route via ingress to backend.
- **DB**: MongoDB (`test_database`), collection `inquiries`.
- **AI**: Gemini via Emergent Universal LLM Key (`EMERGENT_LLM_KEY` in backend/.env) using `emergentintegrations`.

## Core Requirements (static)
- High-converting bilingual marketing site for signage/vehicle-wrapping business.
- Sections: Hero, SocialProof, TrustBadges, ExperienceStats, Services, AI Design Studio, CostCalculator, Testimonials, Process, FAQ, Instagram, InquiryForm, LocationMap, Footer.
- AI chatbot assistant, AI design/image studio, multi-step quote form.

## Implemented (2026-06-23)
- Ported AI Studio export into Emergent (Vite frontend + FastAPI backend).
- `/api/chat` — chatbot (gemini-3.5-flash) with DE/EN system instruction.
- `/api/chat-advanced` — design advisor (gemini-3.1-pro-preview on high-thinking, else gemini-3.5-flash).
- `/api/generate-image` — AI Design Studio image generation/editing (gemini image models / Nano Banana).
- `/api/inquiries` POST+GET — quote requests persisted in MongoDB.
- Activated the AI Design Studio section (was hidden in original).
- Replaced broken Google-Drive hero video with a real vehicle-wrap stock image; generated & added YLRK logo (`/public/logo.png`).
- Verified end-to-end via testing agent: 100% backend, 100% frontend.

## Backlog / Next
- P1: Email notification on new inquiry (needs SendGrid/Resend key) + simple admin dashboard to view inquiries.
- P2: Replace stock hero image with a real customer wrap video (user upload supported via IndexedDB).
- P2: Add `data-testid` attributes to harden automated testing.
- P2: Differentiate inquiry submit error vs success state in UI; use Pydantic EmailStr.

## Notes
- No authentication in app (no credentials needed).
