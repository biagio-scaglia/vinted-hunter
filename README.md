# Vinted Hunter Pro

**Hunters Research Center** — Multi-marketplace research and monitoring platform with visual OCR search, real-time price analytics, and automated radar alerts.

## Features

### Visual OCR Search
Search products by uploading a photo or screenshot. EasyOCR runs locally — your images never leave the server.
- Supports Italian and English text
- Smart noise filtering (strips timestamps, common words, irrelevant tokens)
- Confidence threshold filtering to improve extraction quality

### Multi-Store Search
Search across multiple marketplaces simultaneously and compare results side by side.
- **Vinted** — concurrent multi-page fetch (48 results/page, 2 pages)
- **Subito.it** — Italian classifieds with price filtering
- Extensible registry: adding a new store requires only one new Python file

### Price Filters & Radar Alerts
- Server-side price filtering (min/max passed directly to each marketplace API)
- Save any search as an active Radar — the scheduler checks for new items every 10 minutes
- Desktop notifications when new matches are found

### UI
- Dark "Cyber-Violet" theme (Ant Design v6, Next.js 16, React 19)
- Fully responsive (desktop sidebar + mobile drawer)
- WCAG 2.1 AA accessibility: skip navigation, focus-visible, keyboard navigation, ARIA labels, screen-reader live regions

## Architecture

```
vinted/
├── backend/
│   ├── main.py                  # FastAPI app factory + lifespan
│   ├── models.py                # Pydantic response models
│   ├── middleware/              # Rate limiting, sanitization, security headers, integrity
│   ├── routers/                 # search.py, alerts.py, ocr.py
│   ├── services/
│   │   ├── base.py              # BaseMarketplace abstract class
│   │   ├── registry.py          # Service registry
│   │   ├── vinted.py            # VintedService
│   │   └── subito.py            # SubitoService
│   ├── scheduler/engine.py      # APScheduler — runs check_alerts every 10 min
│   └── storage/database.py      # SQLAlchemy + SQLite
└── frontend/
    ├── src/app/
    │   ├── page.tsx             # Main dashboard + landing
    │   ├── layout.tsx           # Root layout, metadata, PWA
    │   ├── globals.css          # Theme, responsive breakpoints, a11y
    │   ├── components/
    │   │   ├── ProductCard.tsx  # Per-store colored card, keyboard accessible
    │   │   └── Sidebar.tsx      # Filters, source selector, radar list
    │   ├── privacy/page.tsx     # GDPR privacy policy
    │   └── terms/page.tsx       # Terms of service
    └── src/lib/
        ├── api.ts               # Typed API client
        └── types.ts             # Shared TypeScript types
```

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.10+, FastAPI, SQLAlchemy, APScheduler, httpx |
| OCR | EasyOCR, PyTorch (local inference) |
| Frontend | Next.js 16, React 19, Ant Design v6, Tailwind CSS |
| Database | SQLite (local) |

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend
```bash
# From project root
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## Running

### Backend
```bash
# From project root (activating venv first)
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)
API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/search` | Search across one or more stores |
| `GET` | `/sources` | List available marketplaces |
| `GET` | `/alerts` | List saved radar alerts |
| `POST` | `/save-alert` | Create a new radar alert |
| `DELETE` | `/alerts/{id}` | Delete an alert |
| `POST` | `/ocr` | Extract text from an uploaded image |

### Search request body
```json
{
  "query": "Nintendo DS",
  "min_price": 10,
  "max_price": 80,
  "sources": ["vinted", "subito"]
}
```

## Security

- **Rate limiting** — 20 req/min per IP; ban threshold after repeated violations
- **Input sanitization** — XSS, SQL injection, JavaScript injection patterns blocked
- **Security headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Integrity header** — custom `X-Radar-Integrity` header required for mutating requests
- **Privacy by design** — OCR runs locally; no data sent to external AI APIs

### Cloudflare (optional)
1. Set SSL/TLS to **Full (Strict)** to use HSTS headers correctly
2. Enable **Bot Fight Mode** to complement internal rate limiting
3. Set **Edge Cache TTL** for static frontend assets

## Accessibility (WCAG 2.1 AA)

- Skip navigation link for keyboard users
- All interactive elements have `aria-label` or visible labels
- Clickable cards and list items are keyboard-navigable (`role="button"`, `onKeyDown`)
- Live region announces search results to screen readers
- Semantic HTML (`<dl>/<dt>/<dd>` for stats, `<section>` with `aria-labelledby` in docs)
- `focus-visible` ring for keyboard navigation, suppressed for mouse users
- `lang="it"` on root `<html>` element

## Privacy

All data stays local. See [Privacy Policy](/privacy) for full details.

---

Developed by **Biagio**
