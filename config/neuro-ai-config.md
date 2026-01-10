# Multi-Agent AI System Configuration Guide

## Overview

This document describes how to configure the Multi-Agent AI system for the Digital Gift Card Platform using LangChain and LangGraph for agent orchestration.

**Note**: The "Neuro AI SDK" referenced in the original PRD is implemented using LangChain/LangGraph, which provides a flexible, open-source framework for building multi-agent systems.

## Architecture

The system uses 5 specialized agents coordinated by an Orchestration Agent:

1. **Orchestration Agent** - Manages workflow and agent sequencing
2. **Illustrator Agent** - Generates card designs using AI image models
3. **Editor Agent** - Handles text editing, refinement, and layer manipulation
4. **Shopper Agent** - Recommends gift cards based on recipient interests
5. **Scheduling Assistant Agent** - Manages message delivery and scheduling

## Required API Keys

### 1. LangChain (Optional - for monitoring/tracing)
```bash
LANGCHAIN_API_KEY=<your-key>
LANGCHAIN_PROJECT=popgifts-platform
LANGCHAIN_TRACING_V2=true
```

**How to get:**
- Sign up at https://smith.langchain.com/
- Create a new project
- Generate API key from settings
- **Note**: This is optional - only needed for advanced monitoring and debugging

### 2. AI Image Generation (Choose One)

#### Option A: Google AI Studio (Recommended)
```bash
GOOGLE_AI_STUDIO_API_KEY=<your-key>
GOOGLE_AI_PROJECT_ID=<your-project-id>
```

**How to get:**
- Go to https://ai.google.dev/
- Create a new project
- Enable Imagen API
- Generate API credentials

**Models Available:**
- `imagen-2` - Fast, good quality (recommended for MVP)
- `imagen-3` - Higher quality, slower
- `imagen-3-fast` - Balance of speed and quality

#### Option B: Stability AI
```bash
STABILITY_AI_API_KEY=<your-key>
```

**How to get:**
- Sign up at https://platform.stability.ai/
- Generate API key from dashboard

**Models Available:**
- `stable-diffusion-xl-1024-v1-0`
- `stable-diffusion-v1-6`

#### Option C: OpenAI DALL-E
```bash
OPENAI_API_KEY=<your-key>
```

**Models Available:**
- `dall-e-3` - Highest quality
- `dall-e-2` - Faster, lower cost

### 3. AI Text/Editing Models

#### OpenAI (Recommended for Editor Agent)
```bash
OPENAI_API_KEY=<your-key>
```

**How to get:**
- Sign up at https://platform.openai.com/
- Navigate to API keys
- Create new secret key

**Models Available:**
- `gpt-4-turbo-preview` - Best quality (recommended)
- `gpt-4` - Stable, reliable
- `gpt-3.5-turbo` - Faster, lower cost

#### Anthropic Claude (Alternative)
```bash
ANTHROPIC_API_KEY=<your-key>
```

**Models Available:**
- `claude-3-opus` - Highest quality
- `claude-3-sonnet` - Balanced
- `claude-3-haiku` - Fastest

## Agent Configuration

### Illustrator Agent Configuration

```typescript
// config/agents/illustrator.config.ts
export const illustratorConfig = {
  provider: 'google-ai-studio', // or 'stability-ai', 'openai'
  model: 'imagen-2',
  timeout: 15000, // 15 seconds (NFR1 requirement)
  maxRetries: 2,
  imageSize: {
    width: 1024,
    height: 1024
  },
  outputFormat: 'webp',
  quality: 85,
  variations: 3, // Generate 3 design options
  stylePresets: [
    'modern',
    'elegant',
    'playful',
    'minimalist',
    'vibrant'
  ]
};
```

### Editor Agent Configuration

```typescript
// config/agents/editor.config.ts
export const editorConfig = {
  provider: 'openai',
  model: 'gpt-4-turbo-preview',
  timeout: 10000, // 10 seconds for layer edits
  maxRetries: 2,
  features: {
    spellCheck: true,
    grammarCheck: true,
    salutationGeneration: true,
    layerManipulation: true
  },
  textGeneration: {
    temperature: 0.7,
    maxTokens: 500
  }
};
```

### Shopper Agent Configuration

```typescript
// config/agents/shopper.config.ts
export const shopperConfig = {
  neoCurrencyApiKey: process.env.NEOCURRENCY_API_KEY,
  neo4jConfig: {
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD
  },
  recommendationCount: 3,
  personaMatchingThreshold: 0.7,
  cacheTimeout: 300000 // 5 minutes
};
```

### Scheduling Assistant Configuration

```typescript
// config/agents/scheduling.config.ts
export const schedulingConfig = {
  twilioConfig: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  queueConfig: {
    redis: process.env.REDIS_URL,
    maxRetries: 3,
    retryDelay: 60000 // 1 minute
  }
};
```

## Orchestration Agent Configuration

```typescript
// config/agents/orchestration.config.ts
export const orchestrationConfig = {
  neuroAiConfig: {
    apiKey: process.env.NEURO_AI_API_KEY,
    orgId: process.env.NEURO_AI_ORG_ID,
    endpoint: process.env.NEURO_AI_ENDPOINT
  },
  agents: {
    illustrator: illustratorConfig,
    editor: editorConfig,
    shopper: shopperConfig,
    scheduling: schedulingConfig
  },
  workflow: {
    enableParallelProcessing: true,
    errorRecovery: 'retry',
    stateManagement: 'redis'
  },
  monitoring: {
    enableMetrics: true,
    enableTracing: true,
    logLevel: 'info'
  }
};
```

## Setup Steps

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`**

3. **Install Neuro AI SDK:**
   ```bash
   npm install @neuro-ai/sdk
   ```

4. **Initialize agents in your application:**
   ```typescript
   import { NeuroAI } from '@neuro-ai/sdk';
   import { orchestrationConfig } from './config/agents/orchestration.config';
   
   const neuroAI = new NeuroAI(orchestrationConfig.neuroAiConfig);
   ```

5. **Test connection:**
   ```bash
   npm run test:agents
   ```

## Cost Estimation

### Per Card Generation (3 variations):
- **Image Generation**: 
  - Google Imagen: ~$0.15 (3 images × $0.05)
  - Stability AI: ~$0.09 (3 images × $0.03)
  - DALL-E 3: ~$0.12 (3 images × $0.04)

- **Text Processing**:
  - GPT-4 Turbo: ~$0.02 per card
  - Claude 3 Sonnet: ~$0.015 per card

- **Total per card**: ~$0.17 - $0.20

### Monthly Estimates (1,000 cards):
- Image generation: $150 - $180
- Text processing: $15 - $20
- **Total**: ~$165 - $200/month

## Rate Limits

### Google AI Studio
- 60 requests per minute
- 1,500 requests per day (free tier)

### OpenAI
- GPT-4 Turbo: 10,000 TPM (tokens per minute)
- DALL-E 3: 5 images per minute

### Stability AI
- 150 requests per minute

## Monitoring & Debugging

### Enable Debug Logging
```bash
DEBUG=neuro-ai:* npm run dev
```

### Monitor Agent Performance
```typescript
neuroAI.on('agent:start', (agent, context) => {
  console.log(`Agent ${agent.name} started`);
});

neuroAI.on('agent:complete', (agent, result, duration) => {
  console.log(`Agent ${agent.name} completed in ${duration}ms`);
});

neuroAI.on('agent:error', (agent, error) => {
  console.error(`Agent ${agent.name} failed:`, error);
});
```

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Rotate API keys regularly** - Every 90 days
3. **Use environment-specific keys** - Different keys for dev/staging/prod
4. **Implement rate limiting** - Prevent API abuse
5. **Monitor usage** - Set up billing alerts
6. **Encrypt sensitive data** - Use secrets management (AWS Secrets Manager, etc.)

## Troubleshooting

### Issue: "Neuro AI connection failed"
- Verify API key is correct
- Check network connectivity
- Confirm endpoint URL is correct

### Issue: "Image generation timeout"
- Increase timeout in config (max 30s)
- Check AI service status
- Reduce image size or quality

### Issue: "Rate limit exceeded"
- Implement request queuing
- Add exponential backoff
- Consider upgrading API tier

## Next Steps

1. Obtain all required API keys
2. Configure `.env` file
3. Test each agent individually
4. Test full orchestration workflow
5. Monitor performance and costs
6. Optimize based on usage patterns
