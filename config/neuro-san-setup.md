# Neuro-SAN Multi-Agent Setup Guide

## Overview

**Neuro-SAN** (Self-Adaptive Networks) is Cognizant AI Lab's framework for building adaptive multi-agent systems. It's designed for creating agents that can learn and adapt their behavior over time.

**GitHub**: https://github.com/cognizant-ai-lab/neuro-san

## What is Neuro-SAN?

Neuro-SAN is a Python framework that enables:
- **Self-adaptive agents** that learn from interactions
- **Multi-agent coordination** with emergent behaviors
- **Neural architecture search** for agent optimization
- **Evolutionary strategies** for agent improvement

## Installation

### 1. Clone the Repository

```bash
# Navigate to services directory
cd services
git clone https://github.com/cognizant-ai-lab/neuro-san.git
cd neuro-san
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-build.txt

# Install neuro-san in development mode
pip install -e .
```

### 3. Verify Installation

```bash
# Test import
python -c "import neuro_san; print(neuro_san.__version__)"

# Run tests
pytest tests/
```

## Architecture for Digital Gift Card Platform

```
┌─────────────────────────────────────────────────────────┐
│           Node.js Backend (Express/TypeScript)          │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │      Gifting Pipeline Service                   │  │
│   │      (Orchestrates AI calls via REST API)       │  │
│   └──────────────────┬──────────────────────────────┘  │
└────────────────────────┼────────────────────────────────┘
                        │ HTTP REST API
                        ▼
┌─────────────────────────────────────────────────────────┐
│        Python Neuro-SAN Service (FastAPI)               │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │         Neuro-SAN Agent Network                 │  │
│   │                                                 │  │
│   │   ┌──────────────┐      ┌──────────────┐      │  │
│   │   │ Illustrator  │      │   Editor     │      │  │
│   │   │    Agent     │◄────►│    Agent     │      │  │
│   │   │ (Image Gen)  │      │ (Text/Layer) │      │  │
│   │   └──────┬───────┘      └──────┬───────┘      │  │
│   │          │                     │              │  │
│   │          │   ┌──────────────┐  │              │  │
│   │          └──►│ Orchestrator │◄─┘              │  │
│   │              │    Agent     │                 │  │
│   │              └──────┬───────┘                 │  │
│   │                     │                         │  │
│   │          ┌──────────┴──────────┐              │  │
│   │          ▼                     ▼              │  │
│   │   ┌──────────────┐      ┌──────────────┐     │  │
│   │   │   Shopper    │      │  Scheduling  │     │  │
│   │   │    Agent     │      │   Assistant  │     │  │
│   │   │(Gift Cards)  │      │   Agent      │     │  │
│   │   └──────────────┘      └──────────────┘     │  │
│   │                                               │  │
│   └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
services/neuro-san-service/
├── neuro-san/                 # Cloned Neuro-SAN repo
│   ├── neuro_san/
│   │   ├── __init__.py
│   │   ├── agent.py          # Base agent class
│   │   ├── network.py        # Agent network
│   │   └── evolution.py      # Evolutionary strategies
│   └── examples/
├── src/
│   ├── __init__.py
│   ├── main.py               # FastAPI application
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py     # Custom base agent
│   │   ├── illustrator.py    # Image generation agent
│   │   ├── editor.py         # Text/layer editing agent
│   │   ├── shopper.py        # Gift card recommendation agent
│   │   └── scheduler.py      # Message scheduling agent
│   ├── network/
│   │   ├── __init__.py
│   │   └── orchestrator.py   # Agent network orchestrator
│   ├── models/
│   │   ├── __init__.py
│   │   ├── card_state.py     # CardState data model
│   │   └── schemas.py        # Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── openai_service.py # OpenAI integration
│   │   ├── neo4j_service.py  # Neo4j integration
│   │   └── neocurrency.py    # NeoCurrency API client
│   └── api/
│       ├── __init__.py
│       └── routes.py         # FastAPI routes
├── requirements.txt
├── requirements-build.txt
├── .env
├── Dockerfile
└── README.md
```

## Implementation

### 1. Base Agent Class

```python
# src/agents/base_agent.py
from neuro_san.agent import Agent
from typing import Dict, Any, Optional
import openai
from abc import abstractmethod

class CardAgent(Agent):
    """Base agent class for Digital Gift Card Platform"""
    
    def __init__(self, name: str, config: Dict[str, Any]):
        super().__init__(name)
        self.config = config
        self.openai_client = openai.OpenAI(api_key=config.get('openai_api_key'))
        
    @abstractmethod
    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process the current state and return updated state"""
        pass
    
    def adapt(self, feedback: Dict[str, Any]):
        """Adapt agent behavior based on feedback (Neuro-SAN feature)"""
        # Implement adaptive learning logic
        pass
```

### 2. Illustrator Agent

```python
# src/agents/illustrator.py
from .base_agent import CardAgent
from typing import Dict, Any
import asyncio

class IllustratorAgent(CardAgent):
    """Agent responsible for generating card designs using AI"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Illustrator", config)
        self.model = config.get('image_model', 'dall-e-3')
        
    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate card designs from madlib input"""
        madlib_input = state.get('madlib_input')
        
        # Step 1: Generate image prompt
        prompt = await self._generate_prompt(madlib_input)
        
        # Step 2: Generate 3 image variations
        images = await asyncio.gather(
            self._generate_image(prompt, seed=1),
            self._generate_image(prompt, seed=2),
            self._generate_image(prompt, seed=3)
        )
        
        # Step 3: Create layer tree
        layer_tree = self._create_layer_tree(images, madlib_input)
        
        return {
            **state,
            'layer_tree': layer_tree,
            'image_urls': images,
            'current_step': 'illustration_complete'
        }
    
    async def _generate_prompt(self, madlib_input: Dict) -> str:
        """Generate DALL-E prompt from madlib input"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at creating detailed image generation prompts."
                },
                {
                    "role": "user",
                    "content": f"Create a DALL-E prompt for a {madlib_input['occasion']} card for {madlib_input['recipient_name']}, who likes {', '.join(madlib_input['interests'])}. Style: {madlib_input['style']}"
                }
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    
    async def _generate_image(self, prompt: str, seed: int) -> str:
        """Generate a single image using DALL-E"""
        response = await self.openai_client.images.generate(
            model=self.model,
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        return response.data[0].url
    
    def _create_layer_tree(self, images: list, madlib_input: Dict) -> Dict:
        """Create structured layer tree from generated images"""
        return {
            'layers': [
                {
                    'id': 'background',
                    'type': 'image',
                    'image_url': images[0],
                    'x': 0,
                    'y': 0,
                    'width': 1024,
                    'height': 1024
                },
                {
                    'id': 'title',
                    'type': 'text',
                    'content': f"Happy {madlib_input['occasion']}!",
                    'x': 512,
                    'y': 100,
                    'font_size': 48,
                    'font_family': 'Arial',
                    'fill': '#000000'
                }
            ],
            'canvas_width': 1024,
            'canvas_height': 1024
        }
```

### 3. Editor Agent

```python
# src/agents/editor.py
from .base_agent import CardAgent
from typing import Dict, Any

class EditorAgent(CardAgent):
    """Agent responsible for text editing and layer refinement"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Editor", config)
        
    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Refine card design and add text layers"""
        layer_tree = state.get('layer_tree')
        madlib_input = state.get('madlib_input')
        
        # Add salutation if not provided
        if not madlib_input.get('message'):
            salutation = await self._generate_salutation(madlib_input)
            layer_tree['layers'].append({
                'id': 'salutation',
                'type': 'text',
                'content': salutation,
                'x': 512,
                'y': 512,
                'font_size': 24,
                'font_family': 'Georgia',
                'fill': '#333333'
            })
        
        # Grammar check on user message
        if madlib_input.get('message'):
            corrected = await self._check_grammar(madlib_input['message'])
            madlib_input['message'] = corrected
        
        return {
            **state,
            'layer_tree': layer_tree,
            'madlib_input': madlib_input,
            'current_step': 'editing_complete'
        }
    
    async def _generate_salutation(self, madlib_input: Dict) -> str:
        """Generate heartfelt salutation"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a greeting card writer. Create warm, heartfelt messages."
                },
                {
                    "role": "user",
                    "content": f"Write a short {madlib_input['occasion']} message for {madlib_input['recipient_name']}."
                }
            ],
            temperature=0.8
        )
        return response.choices[0].message.content
    
    async def _check_grammar(self, text: str) -> str:
        """Check and correct grammar"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "Fix grammar and spelling errors. Return only the corrected text."
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.3
        )
        return response.choices[0].message.content
```

### 4. Shopper Agent

```python
# src/agents/shopper.py
from .base_agent import CardAgent
from typing import Dict, Any, List
from neo4j import GraphDatabase

class ShopperAgent(CardAgent):
    """Agent responsible for gift card recommendations"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__("Shopper", config)
        self.neo4j_driver = GraphDatabase.driver(
            config['neo4j_uri'],
            auth=(config['neo4j_user'], config['neo4j_password'])
        )
        
    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Recommend gift cards based on recipient interests"""
        madlib_input = state.get('madlib_input')
        
        # Query Neo4j for persona matching
        personas = await self._match_personas(madlib_input['interests'])
        
        # Get gift card recommendations
        gift_cards = await self._recommend_gift_cards(
            madlib_input['interests'],
            madlib_input['occasion']
        )
        
        return {
            **state,
            'gift_card_candidates': gift_cards[:3],  # Top 3
            'matched_personas': personas,
            'current_step': 'shopping_complete'
        }
    
    async def _match_personas(self, interests: List[str]) -> List[Dict]:
        """Match recipient to shopping personas using Neo4j"""
        with self.neo4j_driver.session() as session:
            result = session.run("""
                MATCH (p:Persona)-[:PREFERS]->(c:Category)
                WHERE ANY(interest IN $interests WHERE interest IN p.interests)
                RETURN p, c
                LIMIT 3
            """, interests=interests)
            return [record.data() for record in result]
    
    async def _recommend_gift_cards(self, interests: List[str], occasion: str) -> List[Dict]:
        """Get gift card recommendations using AI"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a gift recommendation expert. Suggest appropriate gift cards with merchant names."
                },
                {
                    "role": "user",
                    "content": f"Recommend 5 gift cards for someone who likes: {', '.join(interests)}. Occasion: {occasion}. Return as JSON array with merchant_name and reason fields."
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        import json
        recommendations = json.loads(response.choices[0].message.content)
        
        # TODO: Query NeoCurrency API to validate and get actual gift cards
        return recommendations.get('gift_cards', [])
```

### 5. Agent Network Orchestrator

```python
# src/network/orchestrator.py
from neuro_san.network import AgentNetwork
from src.agents.illustrator import IllustratorAgent
from src.agents.editor import EditorAgent
from src.agents.shopper import ShopperAgent
from typing import Dict, Any

class CardOrchestrator:
    """Orchestrates the multi-agent workflow using Neuro-SAN"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        
        # Initialize agents
        self.illustrator = IllustratorAgent(config)
        self.editor = EditorAgent(config)
        self.shopper = ShopperAgent(config)
        
        # Create Neuro-SAN network
        self.network = AgentNetwork()
        self.network.add_agent(self.illustrator)
        self.network.add_agent(self.editor)
        self.network.add_agent(self.shopper)
        
        # Define agent connections (communication channels)
        self.network.connect(self.illustrator, self.editor)
        self.network.connect(self.editor, self.shopper)
    
    async def generate_card(self, madlib_input: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the full card generation workflow"""
        
        # Initialize state
        state = {
            'madlib_input': madlib_input,
            'layer_tree': None,
            'gift_card_candidates': [],
            'current_step': 'start',
            'errors': []
        }
        
        try:
            # Step 1: Illustrator generates designs
            state = await self.illustrator.process(state)
            
            # Step 2: Editor refines and adds text
            state = await self.editor.process(state)
            
            # Step 3: Shopper recommends gift cards
            state = await self.shopper.process(state)
            
            state['current_step'] = 'complete'
            
        except Exception as e:
            state['errors'].append(str(e))
            state['current_step'] = 'failed'
        
        return state
    
    async def refine_card(self, state: Dict[str, Any], refinement_prompt: str) -> Dict[str, Any]:
        """Refine existing card based on user prompt"""
        # Use editor agent to apply refinements
        state['refinement_prompt'] = refinement_prompt
        state = await self.editor.process(state)
        return state
```

### 6. FastAPI Application

```python
# src/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

from src.network.orchestrator import CardOrchestrator

load_dotenv()

app = FastAPI(
    title="Neuro-SAN Card Generation Service",
    description="Multi-agent AI system for Digital Gift Card Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
config = {
    'openai_api_key': os.getenv('OPENAI_API_KEY'),
    'image_model': 'dall-e-3',
    'neo4j_uri': os.getenv('NEO4J_URI'),
    'neo4j_user': os.getenv('NEO4J_USER'),
    'neo4j_password': os.getenv('NEO4J_PASSWORD'),
}

# Initialize orchestrator
orchestrator = CardOrchestrator(config)

# Pydantic models
class MadlibInput(BaseModel):
    recipient_name: str
    occasion: str
    age: Optional[int]
    interests: List[str]
    style: str
    message: Optional[str]

class CardGenerationRequest(BaseModel):
    madlib_input: MadlibInput

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "neuro-san-card-generation"}

@app.post("/api/cards/generate")
async def generate_card(request: CardGenerationRequest):
    """Generate card designs using Neuro-SAN multi-agent system"""
    try:
        result = await orchestrator.generate_card(request.madlib_input.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cards/refine")
async def refine_card(state: Dict[str, Any], refinement_prompt: str):
    """Refine card design based on user prompt"""
    try:
        result = await orchestrator.refine_card(state, refinement_prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

## Environment Configuration

```bash
# .env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# NeoCurrency
NEOCURRENCY_API_KEY=...

# Service
API_HOST=0.0.0.0
API_PORT=8000
```

## Running the Service

```bash
# Development
cd services/neuro-san-service
source venv/bin/activate
python src/main.py

# Or with uvicorn
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Node.js Integration

```typescript
// packages/backend-api/src/services/neuro-san-client.ts
import axios from 'axios';

export class NeuroSANClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = process.env.NEURO_SAN_SERVICE_URL || 'http://localhost:8000';
  }
  
  async generateCard(madlibInput: MadlibInput) {
    const response = await axios.post(`${this.baseURL}/api/cards/generate`, {
      madlib_input: madlibInput
    });
    return response.data;
  }
  
  async refineCard(state: any, refinementPrompt: string) {
    const response = await axios.post(`${this.baseURL}/api/cards/refine`, {
      state,
      refinement_prompt: refinementPrompt
    });
    return response.data;
  }
}
```

## Next Steps

1. ✅ Clone Neuro-SAN repository
2. ⏳ Install dependencies
3. ⏳ Implement agent classes
4. ⏳ Set up FastAPI service
5. ⏳ Test agent network
6. ⏳ Integrate with Node.js backend

Ready to start implementation?
