# 🛰️ Vinted Hunter Pro

**Hunters Research Center** - An industrial-grade product hunting system designed for high-performance marketplace monitoring and visual intelligence.

## 🚀 Key Features

### 📸 Pro Visual Radar (EasyOCR)
Advanced image processing pipeline that allows you to search for products simply by uploading a photo or screenshot.
- **Precision OCR**: Powered by `EasyOCR` for high-accuracy text extraction from screenshots (WhatsApp, Reels, apps) and product labels.
- **Smart NLP Cleaning**: Automatically strips noise (e.g., "vendo", "prezzo", timestamps) to isolate the core product keywords.
- **Multi-Language**: Native support for Italian and English text recognition.

### 🔍 Optimized Vinted Engine
A streamlined search aggregator focused exclusively on **Vinted** for maximum stability and speed.
- **Real-time Results**: Combined and sorted by price for immediate comparison.
- **Price Analytics**: Built-in market calculation that shows the estimated average price for every search.
- **History & Monitoring**: Save your favorite searches as active "Radars" and get notified when new items match your criteria.

### 🌌 Cyber-Violet UI
A premium, futuristic interface designed for power users.
- **Modern Palette**: Deep "Cyber-Violet" theme with high-contrast white-on-dark aesthetics.
- **Responsive Drawer**: Minimalist sidebar for managing search history and active monitors.
- **Smooth Animations**: Micro-interactions and smooth transitions for a professional feel.

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python), EasyOCR, SQLAlchemy, SQLite, APScheduler.
- **Frontend**: Next.js (React), Ant Design (AntD), Tailwind CSS.
- **Intelligence**: PyTorch-based OCR models for local text extraction (Privacy-focused).

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
# Requirements: fastapi, easyocr, httpx, sqlalchemy, apscheduler, uvicorn
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 🛡️ Production & Security

Vinted Hunter Pro is hardened for production environments with:
- **Rate Limiting**: Protects the API from scraping and brute-force (20 req/min).
- **Security Headers**: HSTS, CSP, and XSS Protection enabled via middleware.
- **Privacy First**: Local AI processing (OCR) ensures data never leaves your server.

### 🌐 Cloudflare Integration
To put this center behind Cloudflare:
1. **SSL/TLS**: Set to "Full (Strict)" to leverage the HSTS headers.
2. **WAF Rules**: Enable "Bot Fight Mode" to complement the internal rate limiting.
3. **Caching**: Utilize "Edge Cache TTL" for search UI assets to improve LCP.

---
Developed with ❤️ by **Biagio**
