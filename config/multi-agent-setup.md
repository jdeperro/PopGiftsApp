# Multi-Agent AI System Setup (LangGraph)

## Overview

Since Cognizant AI Labs doesn't have a public multi-agent orchestration framework, we'll use **LangGraph** - the industry-standard solution for building multi-agent AI systems.

## Why LangGraph?

- ✅ **Purpose-built** for multi-agent orchestration
- ✅ **Production-ready** - Used by thousands of companies
- ✅ **Flexible** - Works with OpenAI, Anthropic, Google, etc.
- ✅ **Well-documented** - Extensive guides and examples
- ✅ **TypeScript support** - Native Node.js integration
- ✅ **Open source** - No vendor lock-in

## Installation

```bash
# Core packages
npm install langchain @langchain/core @langchain/openai langgraph

# Additional providers (choose what you need)
npm install @langchain/anthropic @langchain/google-genai

# Utilities
npm install zod dotenv
```

## Architecture

```typescript
// packages/backend-api/src/agents/orchestrator.ts
import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// Define the state that flows between agents
interface CardState {
  madlibInput: MadlibInput;
  layerTree: LayerTree | null;
  giftCardCandidates: GiftCard[];
  scheduleMetadata: ScheduleMetadata | null;
  currentStep: string;
  errors: string[];
}

// Create the orchestrator
export class CardOrchestrator {
  private workflow: StateGraph<CardState>;
  
  constructor() {
    this.workflow = new StateGraph<CardState>({
      channels: {
        madlibInput: null,
        layerTree: null,
        giftCardCandidates: [],
        scheduleMetadata: null,
        currentStep: "start",
        errors: []
      }
    });
    
    this.buildWorkflow();
  }
  
  private buildWorkflow() {
    // Add agent nodes
    this.workflow.addNode("illustrator", this.illustratorAgent);
    this.workflow.addNode("editor", this.editorAgent);
    this.workflow.addNode("shopper", this.shopperAgent);
    this.workflow.addNode("scheduler", this.schedulerAgent);
    
    // Define the flow
    this.workflow.addEdge("__start__", "illustrator");
    this.workflow.addEdge("illustrator", "editor");
    this.workflow.addEdge("editor", "shopper");
    this.workflow.addConditionalEdges(
      "shopper",
      (state) => state.scheduleMetadata ? "scheduler" : END
    );
    this.workflow.addEdge("scheduler", END);
    
    this.workflow = this.workflow.compile();
  }
  
  private async illustratorAgent(state: CardState): Promise<Partial<CardState>> {
    // Implement illustrator logic
    const layerTree = await generateCardDesign(state.madlibInput);
    return { layerTree, currentStep: "illustration_complete" };
  }
  
  private async editorAgent(state: CardState): Promise<Partial<CardState>> {
    // Implement editor logic
    const refinedLayerTree = await refineDesign(state.layerTree);
    return { layerTree: refinedLayerTree, currentStep: "editing_complete" };
  }
  
  private async shopperAgent(state: CardState): Promise<Partial<CardState>> {
    // Implement shopper logic
    const giftCardCandidates = await recommendGiftCards(state.madlibInput);
    return { giftCardCandidates, currentStep: "shopping_complete" };
  }
  
  private async schedulerAgent(state: CardState): Promise<Partial<CardState>> {
    // Implement scheduler logic
    await scheduleDelivery(state.scheduleMetadata);
    return { currentStep: "complete" };
  }
  
  async execute(input: MadlibInput): Promise<CardState> {
    const initialState: CardState = {
      madlibInput: input,
      layerTree: null,
      giftCardCandidates: [],
      scheduleMetadata: null,
      currentStep: "start",
      errors: []
    };
    
    const result = await this.workflow.invoke(initialState);
    return result;
  }
}
```

## Agent Implementations

### 1. Illustrator Agent (Image Generation)

```typescript
// packages/backend-api/src/agents/illustrator.ts
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

export class IllustratorAgent {
  private llm: ChatOpenAI;
  private imageClient: OpenAI;
  
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7
    });
    
    this.imageClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async generateCardDesign(madlibInput: MadlibInput): Promise<LayerTree> {
    // Step 1: Generate image prompt from madlib
    const promptResponse = await this.llm.invoke([
      {
        role: "system",
        content: "You are an expert at creating detailed image generation prompts for greeting cards."
      },
      {
        role: "user",
        content: `Create a detailed DALL-E prompt for a ${madlibInput.occasion} card for ${madlibInput.recipientName}, age ${madlibInput.age}, who likes ${madlibInput.interests.join(", ")}. Style: ${madlibInput.style}`
      }
    ]);
    
    const imagePrompt = promptResponse.content;
    
    // Step 2: Generate 3 variations
    const variations = await Promise.all([
      this.generateImage(imagePrompt, "variation1"),
      this.generateImage(imagePrompt, "variation2"),
      this.generateImage(imagePrompt, "variation3")
    ]);
    
    // Step 3: Create layer tree
    return this.createLayerTree(variations, madlibInput);
  }
  
  private async generateImage(prompt: string, seed: string): Promise<string> {
    const response = await this.imageClient.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    
    return response.data[0].url;
  }
  
  private createLayerTree(imageUrls: string[], madlibInput: MadlibInput): LayerTree {
    // Create structured layer tree
    return {
      layers: [
        {
          id: "background",
          type: "image",
          imageUrl: imageUrls[0],
          x: 0,
          y: 0,
          width: 1024,
          height: 1024
        },
        {
          id: "title",
          type: "text",
          content: `Happy ${madlibInput.occasion}!`,
          x: 512,
          y: 100,
          fontSize: 48,
          fontFamily: "Arial",
          fill: "#000000"
        }
      ],
      canvasWidth: 1024,
      canvasHeight: 1024
    };
  }
}
```

### 2. Editor Agent (Text & Refinement)

```typescript
// packages/backend-api/src/agents/editor.ts
import { ChatOpenAI } from "@langchain/openai";

export class EditorAgent {
  private llm: ChatOpenAI;
  
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7
    });
  }
  
  async refineDesign(layerTree: LayerTree, prompt: string): Promise<LayerTree> {
    const response = await this.llm.invoke([
      {
        role: "system",
        content: "You are an expert graphic designer. Modify the layer tree based on user instructions."
      },
      {
        role: "user",
        content: `Current design: ${JSON.stringify(layerTree)}\n\nUser request: ${prompt}\n\nReturn the modified layer tree as JSON.`
      }
    ]);
    
    return JSON.parse(response.content);
  }
  
  async generateSalutation(occasion: string, recipientName: string): Promise<string> {
    const response = await this.llm.invoke([
      {
        role: "system",
        content: "You are a greeting card writer. Create warm, heartfelt messages."
      },
      {
        role: "user",
        content: `Write a short, heartfelt ${occasion} message for ${recipientName}.`
      }
    ]);
    
    return response.content;
  }
  
  async checkGrammar(text: string): Promise<string> {
    const response = await this.llm.invoke([
      {
        role: "system",
        content: "You are a grammar checker. Fix any errors and return the corrected text."
      },
      {
        role: "user",
        content: text
      }
    ]);
    
    return response.content;
  }
}
```

### 3. Shopper Agent (Gift Card Recommendations)

```typescript
// packages/backend-api/src/agents/shopper.ts
import { ChatOpenAI } from "@langchain/openai";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";

export class ShopperAgent {
  private llm: ChatOpenAI;
  private graph: Neo4jGraph;
  
  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview"
    });
    
    this.graph = new Neo4jGraph({
      url: process.env.NEO4J_URI,
      username: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASSWORD
    });
  }
  
  async recommendGiftCards(madlibInput: MadlibInput): Promise<GiftCard[]> {
    // Step 1: Match persona using Neo4j
    const personaQuery = `
      MATCH (p:Persona)-[:PREFERS]->(c:Category)
      WHERE ANY(interest IN $interests WHERE interest IN p.interests)
      RETURN p, c
      LIMIT 3
    `;
    
    const personas = await this.graph.query(personaQuery, {
      interests: madlibInput.interests
    });
    
    // Step 2: Get gift card recommendations
    const recommendations = await this.llm.invoke([
      {
        role: "system",
        content: "You are a gift recommendation expert. Suggest appropriate gift cards."
      },
      {
        role: "user",
        content: `Recommend 3 gift cards for someone who likes: ${madlibInput.interests.join(", ")}. Occasion: ${madlibInput.occasion}`
      }
    ]);
    
    // Step 3: Query NeoCurrency API
    return await this.fetchGiftCardsFromNeoCurrency(recommendations.content);
  }
  
  private async fetchGiftCardsFromNeoCurrency(recommendations: string): Promise<GiftCard[]> {
    // Implementation to call NeoCurrency API
    return [];
  }
}
```

## Environment Setup

```bash
# .env
# OpenAI (for both image and text)
OPENAI_API_KEY=your-openai-api-key

# Alternative: Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key

# Alternative: Google Gemini
GOOGLE_AI_API_KEY=...

# LangSmith (optional - for monitoring)
LANGCHAIN_API_KEY=...
LANGCHAIN_PROJECT=popgifts-platform
LANGCHAIN_TRACING_V2=true

# Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Other services
NEOCURRENCY_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

## Usage Example

```typescript
// In your Express route
import { CardOrchestrator } from './agents/orchestrator';

const orchestrator = new CardOrchestrator();

app.post('/api/cards/generate', async (req, res) => {
  try {
    const result = await orchestrator.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Cost Estimate

### Per Card Generation:
- **DALL-E 3**: $0.04 per image × 3 = $0.12
- **GPT-4 Turbo**: ~$0.02 for text processing
- **Total**: ~$0.14 per card

### Monthly (1,000 cards):
- **Total**: ~$140/month

## Next Steps

1. Install LangGraph and dependencies
2. Set up OpenAI API key
3. Implement agent classes
4. Test individual agents
5. Test full orchestration
6. Add monitoring with LangSmith

Would you like me to proceed with this LangGraph implementation?
