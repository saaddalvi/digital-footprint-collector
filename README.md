# 🔍 Digital Footprint Collector (DFC)

A comprehensive OSINT (Open Source Intelligence) tool for discovering digital footprints across the internet. Search by username, email, or name to find social media profiles, professional accounts, and public records.

![Digital Footprint Collector](https://img.shields.io/badge/OSINT-Tool-blue)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal)

## ✨ Features

- 🔎 **Username Search** - Check 24+ platforms including GitHub, Twitter, Instagram, LinkedIn, etc.
- 📧 **Email Search** - Domain WHOIS lookup and associated social accounts
- 👤 **Name Search** - Find professional profiles, social media, and generate search queries
- 📄 **PDF Reports** - Generate professional formatted PDF reports
- 💾 **JSON Export** - Export raw data for further analysis
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- ⚡ **Fast & Async** - Concurrent requests for quick results

## 🚀 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **aiohttp** - Asynchronous HTTP client
- **python-whois** - WHOIS domain lookup
- **Pydantic** - Data validation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **jsPDF** - PDF generation

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Select Search Type**: Choose between Username, Email, or Name search
2. **Enter Query**: Input the username, email, or name you want to search
3. **Get Results**: View comprehensive results organized by platform and confidence
4. **Export**: Download results as JSON or generate a professional PDF report

### Search Types

#### Username Search
- Searches 10+ platforms
- Shows found/not found status
- Direct links to profiles

#### Email Search
- WHOIS domain information
- Email provider detection
- Associated social media accounts

#### Name Search
- Username variations generation
- Professional profile search (LinkedIn, GitHub)
- Social media profile search
- Public records search queries
- Confidence-based grouping

## 📸 Screenshots

### Username Search
Search across multiple platforms simultaneously.

### Email Search
Get domain information and associated accounts.

### Name Search
Comprehensive search with username variations.

### PDF Report
Professional formatted reports with all findings.

## 🔒 Privacy & Ethics

This tool is designed for:
- ✅ Personal digital footprint auditing
- ✅ Security research and education
- ✅ Background verification (with consent)

**NOT for:**
- ❌ Stalking or harassment
- ❌ Unauthorized data collection
- ❌ Violating privacy laws

