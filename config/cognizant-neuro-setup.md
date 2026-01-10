# Cognizant Neuro AI Setup Guide

## Overview

Cognizant Neuro is a Python-based AI framework. Since our main application is Node.js/TypeScript, we'll set up Neuro as a microservice that the Node.js backend communicates with via REST API or gRPC.

## Architecture

```
┌─────────────────────────────────────────┐
│   Node.js Backend (Express/TypeScript)  │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │   Gifting Pipeline Service      │  │
│   │   (Orchestrates AI calls)       │  │
│   └──────────────┬──────────────────┘  │
└──────────────────┼──────────────────────┘
                   │ HTTP/gRPC
                   ▼
┌─────────────────────────────────────────┐
│   Python Neuro AI Service               │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │   Neuro Agent Orchestrator      │  │
│   │   ┌──────────┐  ┌──────────┐   │  │
│   │   │Illustrator│  │  Editor  │   │  │
│   │   │  Agent   │  │  Agent   │   │  │
│   │   └──────────┘  └──────────┘   │  │
│   │   ┌──────────┐  ┌──────────┐   │  │
│   │   │ Shopper  │  │Scheduling│   │  │
│   │   │  Agent   │  │ Assistant│   │  │
│   │   └──────────┘  └──────────┘   │  │
│   └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Installation Steps

### 1. Set up Python Environment

```bash
# Create Python service directory
mkdir -p services/neuro-ai-service
cd services/neuro-ai-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install system dependencies
apt-get update && apt-get install -y shellcheck

# Create requirements files
```

### 2. Create Requirements Files

**requirements.txt** (main dependencies):
```txt
# Cognizant Neuro Framework
neuro-ai>=1.0.0

# AI/ML Libraries
openai>=1.0.0
anthropic>=0.7.0
google-generativeai>=0.3.0
stability-sdk>=0.8.0

# Web Framework
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.0.0

# Database
psycopg2-binary>=2.9.0
redis>=5.0.0
neo4j>=5.14.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
pillow>=10.0.0
aiohttp>=3.9.0
```

**requirements-build.txt** (build/dev dependencies):
```txt
pytest>=7.4.0
pytest-asyncio>=0.21.0
black>=23.0.0
flake8>=6.1.0
mypy>=1.7.0
pylint>=3.0.0
```

### 3. Install Dependencies

```bash
# Install build dependencies
pip install -r requirements-build.txt

# Install main dependencies
pip install -r requirements.txt

# Verify installation
pip freeze
```

### 4. Project Structure

```
services/neuro-ai-service/
├── venv/                      # Virtual environment
├── requirements.txt
├── requirements-build.txt
├── .env                       # Environment variables
├── main.py                    # FastAPI application entry
├── config/
│   ├── __init__.py
│   ├── settings.py           # Configuration management
│   └── agents.py             # Agent configurations
├── agents/
│   ├── __init__.py
│   ├── orchestrator.py       # Main orchestration agent
│   ├── illustrator.py        # Image generation agent
│   ├── editor.py             # Text editing agent
│   ├── shopper.py            # Gift card recommendation agent
│   └── scheduling.py         # Message scheduling agent
├── models/
│   ├── __init__.py
│   ├── card_state.py         # CardState data model
│   └── schemas.py            # Pydantic schemas for API
├── services/
│   ├── __init__.py
│   ├── image_generation.py   # AI image service wrapper
│   ├── text_generation.py    # AI text service wrapper
│   └── database.py           # Database connections
├── api/
│   ├── __init__.py
│   ├── routes.py             # API endpoints
│   └── middleware.py         # Auth, logging, etc.
├── tests/
│   ├── __init__.py
│   ├── test_agents.py
│   └── test_api.py
└── Dockerfile                # Container configuration
```

### 5. Environment Configuration

Create `.env` file in `services/neuro-ai-service/`:

```bash
# Neuro AI Configuration
NEURO_ENV=development
NEURO_LOG_LEVEL=INFO

# AI Service API Keys
OPENAI_API_KEY=your_openai_key_here
GOOGLE_AI_API_KEY=your_google_ai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
STABILITY_AI_API_KEY=your_stability_key_here

# Database Connections
DATABASE_URL=postgresql://user:password@localhost:5432/popgifts
REDIS_URL=redis://localhost:6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_SECRET_KEY=your_secret_key_here

# Node.js Backend URL (for callbacks)
BACKEND_URL=http://localhost:3001

# Performance Settings
AI_GENERATION_TIMEOUT=15
AI_MAX_RETRIES=3
WORKER_PROCESSES=4
```

### 6. Create FastAPI Application

**main.py**:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from agents.orchestrator import NeuroOrchestrator
from models.schemas import (
    CardGenerationRequest,
    CardGenerationResponse,
    CardRefinementRequest,
    LayerEditRequest
)
from config.settings import settings

app = FastAPI(
    title="Neuro AI Service",
    description="Multi-agent AI system for Digital Gift Card Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = NeuroOrchestrator()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "neuro-ai"}

@app.post("/api/cards/generate", response_model=CardGenerationResponse)
async def generate_card(request: CardGenerationRequest):
    """Generate 3 card design variations from madlib input"""
    try:
        result = await orchestrator.generate_card(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cards/refine")
async def refine_card(request: CardRefinementRequest):
    """Refine card designs based on user prompt"""
    try:
        result = await orchestrator.refine_card(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cards/edit-layer")
async def edit_layer(request: LayerEditRequest):
    """Edit specific layer using AI or direct manipulation"""
    try:
        result = await orchestrator.edit_layer(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/gift-cards/recommend")
async def recommend_gift_cards(request: dict):
    """Recommend gift cards based on recipient interests"""
    try:
        result = await orchestrator.recommend_gift_cards(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.NEURO_ENV == "development",
        workers=settings.WORKER_PROCESSES if settings.NEURO_ENV == "production" else 1
    )
```

### 7. Run the Service

```bash
# Development mode
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 8. Docker Configuration

**Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    shellcheck \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt requirements-build.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements-build.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml** (add to root):
```yaml
version: '3.8'

services:
  neuro-ai-service:
    build: ./services/neuro-ai-service
    ports:
      - "8000:8000"
    environment:
      - NEURO_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/popgifts
      - REDIS_URL=redis://redis:6379
      - NEO4J_URI=bolt://neo4j:7687
    env_file:
      - ./services/neuro-ai-service/.env
    depends_on:
      - postgres
      - redis
      - neo4j
    volumes:
      - ./services/neuro-ai-service:/app
    command: uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 9. Node.js Integration

**packages/backend-api/src/services/neuro-client.ts**:
```typescript
import axios, { AxiosInstance } from 'axios';

export class NeuroAIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEURO_AI_SERVICE_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async generateCard(madlibInput: MadlibInput): Promise<CardGenerationResponse> {
    const response = await this.client.post('/api/cards/generate', madlibInput);
    return response.data;
  }

  async refineCard(refinementRequest: CardRefinementRequest): Promise<CardGenerationResponse> {
    const response = await this.client.post('/api/cards/refine', refinementRequest);
    return response.data;
  }

  async editLayer(editRequest: LayerEditRequest): Promise<LayerTree> {
    const response = await this.client.post('/api/cards/edit-layer', editRequest);
    return response.data;
  }

  async recommendGiftCards(interests: string[]): Promise<GiftCard[]> {
    const response = await this.client.post('/api/gift-cards/recommend', { interests });
    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  }
}
```

## Getting Cognizant Neuro Access

### Option 1: Cognizant Enterprise License
If you're working with Cognizant:
1. Contact your Cognizant account manager
2. Request access to Neuro AI platform
3. They'll provide installation packages and API credentials

### Option 2: Neuro Open Source (if available)
Check if there's a public repository:
- GitHub: https://github.com/cognizant
- PyPI: `pip search neuro-ai`

### Option 3: Alternative (if Neuro is not accessible)
Use LangChain/LangGraph as mentioned earlier, which provides similar multi-agent capabilities.

## Next Steps

1. ✅ Create Python service directory structure
2. ⏳ Obtain Cognizant Neuro access/license
3. ⏳ Install Neuro framework
4. ⏳ Implement agent classes
5. ⏳ Set up FastAPI endpoints
6. ⏳ Test Node.js ↔ Python communication
7. ⏳ Deploy with Docker

## Questions to Answer

1. **Do you have Cognizant Neuro access?** (Enterprise license or open source?)
2. **What's the Neuro package name?** (for pip install)
3. **Do you have Neuro documentation?** (API reference, examples)

Let me know and I'll help you proceed with the actual implementation!
