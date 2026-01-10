# Design Document

## Overview

The Digital Gift Card Platform is architected as a mobile-first web application built on a monorepo structure with a monolithic backend service.

**Figma Design File**: [ThxGPT](https://www.figma.com/design/pX3IcAalsJ3TVTP51de8PX/ThxGPT?node-id=0-1&t=c6aOi84bjBsSMI6D-1)  
**Design Integration Guide**: See `design/figma/figma-integration.md` for details on integrating Figma designs with the codebase. The system integrates multiple AI agents through the Neuro AI SDK to handle card generation and editing, while orchestrating external services (NeoCurrency, Stripe, messaging APIs) to deliver a seamless gifting experience.

The architecture prioritizes:
- **Performance**: Sub-15 second AI generation with optimized asset delivery
- **Security**: TLS 1.3 encryption, PCI compliance via Stripe, secure token-based authentication
- **Scalability**: Support for 1,000+ concurrent users with efficient database queries and caching
- **Extensibility**: Agent-based design allowing independent improvement of AI capabilities

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Web Client                        │
│              (React/Next.js + Tailwind CSS)                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/TLS 1.3
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                          │
│            (Authentication, Rate Limiting)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Monolithic Backend                          │
│                  (Node.js/TypeScript)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Neuro AI Multi-Agent System                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │Illustrator │  │   Editor   │  │  Shopper   │    │  │
│  │  │   Agent    │  │   Agent    │  │   Agent    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────────────────────┐    │  │
│  │  │ Scheduling │  │   Orchestration Agent      │    │  │
│  │  │ Assistant  │  │      (Manager)             │    │  │
│  │  └────────────┘  └────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Core Services                           │  │
│  │  • Authentication Service                            │  │
│  │  • Gifting Pipeline Service                          │  │
│  │  • Messaging & Scheduler Service                     │  │
│  │  • Wallet Pass Generator                             │  │
│  │  • Knowledge Graph Service (Shopping Personas)       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬──────────────┐
        ▼            ▼            ▼              ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
   │ Stripe  │  │NeoCurr  │  │   AI    │  │Messaging │
   │   API   │  │ency API │  │ Image   │  │API(Twilio│
   └─────────┘  └─────────┘  │ Service │  └──────────┘
                              └─────────┘
        ┌────────────┴────────────┐
        ▼                         ▼
   ┌─────────┐              ┌──────────┐
   │PostgreSQL│              │  Neo4j   │
   │ Database │              │Knowledge │
   └─────────┘              │  Graph   │
                            └──────────┘
```

### Technology Stack

**Frontend:**
- Framework: React 18+ with Next.js 14 (App Router for SSR/SSG)
- Styling: Tailwind CSS with custom design system
- Canvas Editing: Konva.js for layer manipulation
- Animation: Lottie for card animations, GSAP for UI transitions
- State Management: React Context + Zustand for complex editor state
- API Client: Axios with interceptors for auth tokens

**Backend:**
- Runtime: Node.js 20+ with TypeScript 5+
- Framework: Express.js with middleware for auth, validation, rate limiting
- AI Framework: Neuro AI SDK for multi-agent orchestration
- Database: PostgreSQL 15+ with Prisma ORM
- Graph Database: Neo4j for shopping persona knowledge graph
- Caching: Redis for session management and API response caching
- Job Queue: Bull for scheduled message delivery
- File Storage: AWS S3 or Cloudflare R2 for card images and assets

**External Services:**
- Payment: Stripe API (with Apple Pay/Google Pay)
- Gift Cards: NeoCurrency API
- AI Image Generation: Google AI Studio (Imagen) with fallback to Stability AI
- Messaging: Twilio SMS API
- Wallet: PassKit for Apple Wallet, Google Wallet API

## Components and Interfaces

### Frontend Components

#### 1. Authentication Module
**Components:**
- `PhoneAuthForm`: Phone number input with SMS verification
- `SocialAuthButtons`: Apple and Google OAuth buttons
- `ContactPermissionModal`: Native-style permission request

**State Management:**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  contactsPermission: 'granted' | 'denied' | 'pending';
  contacts: Contact[];
}
```

#### 2. Card Creation Flow
**Components:**
- `MadlibPromptInput`: Guided text input with placeholders
- `TemplateGallery`: Scrollable grid of pre-designed templates
- `ImageUploadButton`: File picker with image preview
- `DesignPreviewGrid`: Three-column preview display
- `RefinementPromptInput`: Bottom-pinned prompt field

**Key Interface:**
```typescript
interface MadlibInput {
  recipientName: string;
  occasion: string;
  age?: number;
  interests: string[];
  style: string;
  recipientImage?: File;
}

interface CardPreview {
  id: string;
  imageUrl: string;
  layerTree: LayerTree;
  thumbnailUrl: string;
}
```

#### 3. Advanced Card Editor
**Components:**
- `CardCanvas`: Main Konva.js canvas with layer rendering
- `TopSubNav`: Tab navigation (Edit, Effects, Animation, Buy, Schedule)
- `LeftToolbar`: Contextual tools based on selected layer
- `RightPanel`: Layer tree and AI prompt interface
- `LayerTreeView`: Hierarchical layer display with drag-drop
- `TextEditingToolbar`: Font, size, color, alignment controls
- `EffectsPanel`: Visual effects library
- `AnimationTimeline`: Timeline control with audio integration

**Core Data Structure:**
```typescript
interface LayerTree {
  layers: Layer[];
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}

interface Layer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  effects: Effect[];
  animation?: Animation;
  // Type-specific properties
  text?: TextProperties;
  image?: ImageProperties;
  shape?: ShapeProperties;
}

interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  fill: string;
  align: 'left' | 'center' | 'right';
}

interface Effect {
  type: 'shadow' | 'glow' | 'blur' | 'filter';
  parameters: Record<string, any>;
}

interface Animation {
  type: 'typewriter' | 'pop' | 'spin' | 'confetti';
  duration: number;
  delay: number;
  easing: string;
}
```

#### 4. Gift Card Selection
**Components:**
- `GiftCardRecommendations`: Three recommended cards
- `GiftCardCatalogSearch`: Searchable sidebar with 1,500+ merchants
- `GiftCardValueInput`: Cash value assignment
- `ProductSearchModal`: Amazon/Walmart product search for tailored cards

#### 5. Checkout and Payment
**Components:**
- `CheckoutCart`: Itemized breakdown display
- `StripePaymentForm`: Stripe Elements integration
- `ApplePayButton`: Apple Pay integration
- `GooglePayButton`: Google Pay integration
- `SignatureInput`: From line and message editing

#### 6. Group Gifting Orchestration
**Components:**
- `ContactSelector`: Multi-select from device contacts
- `DateTimePicker`: Delivery scheduling
- `InvitationTextDisplay`: Copy-paste message with unique links
- `PartyPage`: Viewer message drafting interface
- `StickerPackSelector`: Custom sticker integration
- `StickerPackDownload`: Download button for keyboard integration

#### 7. Recipient Experience
**Components:**
- `AnimatedCardReveal`: Full-screen Lottie animation with audio
- `WalletDownloadButton`: Prominent CTA for wallet pass
- `CardOpenedTracker`: Event tracking for viewer message triggers

### Backend Services

#### 1. Authentication Service
**Responsibilities:**
- Phone number verification via SMS
- Apple and Google OAuth integration
- JWT token generation and validation
- Session management with Redis
- VCard profile synchronization

**API Endpoints:**
```
POST /api/auth/phone/request-code
POST /api/auth/phone/verify-code
POST /api/auth/social/apple
POST /api/auth/social/google
POST /api/auth/refresh-token
GET  /api/auth/profile
PUT  /api/auth/profile
```

**Key Interface:**
```typescript
interface User {
  id: string;
  phoneNumber: string;
  socialId?: string;
  socialProvider?: 'apple' | 'google';
  profileData: {
    name: string;
    email?: string;
    avatar?: string;
  };
  contactsPermission: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Neuro AI Multi-Agent System

**Orchestration Agent (Manager):**
- Manages CardState context object
- Sequences specialized agents
- Handles error recovery and retries
- Enforces 15-second generation timeout

**CardState Context:**
```typescript
interface CardState {
  madlibInput: MadlibInput;
  layerTree: LayerTree;
  giftCardCandidates: GiftCard[];
  scheduleMetadata: ScheduleMetadata;
  processingStatus: 'idle' | 'generating' | 'editing' | 'complete';
  history: CardStateSnapshot[];
}
```

**Illustrator Agent:**
- Consumes Madlib inputs
- Calls AI Image Service (Google AI Studio)
- Generates base layer composition
- Creates three design variations
- Returns updated CardState with layerTree populated

**Editor Agent:**
- Performs text layer manipulation
- Applies visual effects
- Handles AI-prompted edits
- Spell-check and grammar validation
- Generates draft salutations
- Updates specific layers in layerTree

**Shopper Agent:**
- Analyzes recipient interests from Madlib
- Queries NeoCurrency API for catalog
- Queries Neo4j knowledge graph for persona matching
- Scores and ranks gift card candidates
- Returns top 3 recommendations
- Handles product-specific gift card creation

**Scheduling Assistant Agent:**
- Manages Pop Party orchestration
- Generates unique invitation URLs
- Schedules gift delivery via Bull queue
- Triggers Twilio SMS at scheduled time
- Tracks card opened events
- Delivers viewer messages post-open

**Agent Communication Flow:**
```typescript
// Example: Initial card generation
async function generateCard(madlibInput: MadlibInput): Promise<CardState> {
  const orchestrator = new OrchestrationAgent();
  
  // Initialize state
  let cardState: CardState = {
    madlibInput,
    layerTree: null,
    giftCardCandidates: [],
    scheduleMetadata: null,
    processingStatus: 'generating',
    history: []
  };
  
  // Step 1: Generate base design
  cardState = await orchestrator.invoke(illustratorAgent, cardState);
  
  // Step 2: Add text and polish
  cardState = await orchestrator.invoke(editorAgent, cardState);
  
  // Step 3: Recommend gift cards
  cardState = await orchestrator.invoke(shopperAgent, cardState);
  
  cardState.processingStatus = 'complete';
  return cardState;
}
```

#### 3. Gifting Pipeline Service
**Responsibilities:**
- Coordinates end-to-end purchase flow
- Manages Stripe payment processing
- Calls NeoCurrency API for gift card issuance
- Creates Pop Party records
- Generates custom sticker packs
- Hands off to Scheduling Assistant

**API Endpoints:**
```
POST /api/cards/generate
POST /api/cards/refine
POST /api/cards/edit-layer
GET  /api/cards/:id
POST /api/gift-cards/search
POST /api/gift-cards/products/search
POST /api/checkout/create-intent
POST /api/checkout/confirm
POST /api/pop-party/create
POST /api/pop-party/:id/invite
```

#### 4. Messaging & Scheduler Service
**Responsibilities:**
- Bull queue management for scheduled deliveries
- Twilio SMS integration
- Group thread orchestration
- Card opened event tracking
- Viewer message delivery triggers

**Job Queue Structure:**
```typescript
interface GiftDeliveryJob {
  popPartyId: string;
  recipientPhone: string;
  viewerPhones: string[];
  cardUrl: string;
  scheduledTime: Date;
}

interface ViewerMessageJob {
  popPartyId: string;
  viewerId: string;
  recipientPhone: string;
  message: string;
  triggerEvent: 'card_opened';
}
```

#### 5. Wallet Pass Generator
**Responsibilities:**
- Consumes NeoCurrency pass data
- Generates Apple Wallet PassKit files
- Generates Google Wallet passes
- Signs passes with certificates
- Serves pass download endpoints

**API Endpoints:**
```
GET /api/wallet/apple/:giftCardId
GET /api/wallet/google/:giftCardId
```

#### 6. Knowledge Graph Service (Shopping Personas)
**Responsibilities:**
- Maintains Neo4j graph of products, categories, and personas
- Analyzes recipient interests to match personas
- Provides product recommendations for tailored gift cards
- Tracks shopping behavior data

**Graph Schema:**
```cypher
// Nodes
(:Product {id, name, category, price, retailer, imageUrl})
(:Category {id, name, parentCategory})
(:Persona {id, name, interests[], ageRange, preferences})
(:Recipient {id, interests[], occasion, age})

// Relationships
(:Product)-[:BELONGS_TO]->(:Category)
(:Persona)-[:PREFERS]->(:Category)
(:Persona)-[:LIKES]->(:Product)
(:Recipient)-[:MATCHES]->(:Persona)
```

**API Endpoints:**
```
POST /api/personas/match
GET  /api/products/recommend
POST /api/products/search
POST /api/analytics/track-behavior
```

## Data Models

### PostgreSQL Schema

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  social_id VARCHAR(255),
  social_provider VARCHAR(20),
  profile_data JSONB,
  contacts_permission BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_social ON users(social_id, social_provider);

-- Card Designs
CREATE TABLE card_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prompt_log JSONB NOT NULL,
  layer_tree JSONB NOT NULL,
  final_image_url TEXT,
  thumbnail_url TEXT,
  animation_config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_card_designs_user ON card_designs(user_id);

-- Gift Transactions
CREATE TABLE gift_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_phone VARCHAR(20) NOT NULL,
  card_design_id UUID REFERENCES card_designs(id),
  gift_card_merchant VARCHAR(255) NOT NULL,
  gift_card_value DECIMAL(10, 2) NOT NULL,
  card_fee DECIMAL(10, 2) DEFAULT 1.00,
  tax DECIMAL(10, 2),
  total_amount DECIMAL(10, 2) NOT NULL,
  stripe_charge_id VARCHAR(255) UNIQUE,
  neocurrency_pass_id VARCHAR(255) UNIQUE,
  product_specific BOOLEAN DEFAULT FALSE,
  product_data JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gift_transactions_sender ON gift_transactions(sender_id);
CREATE INDEX idx_gift_transactions_status ON gift_transactions(status);

-- Pop Parties
CREATE TABLE pop_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_transaction_id UUID REFERENCES gift_transactions(id),
  card_design_id UUID REFERENCES card_designs(id),
  recipient_phone VARCHAR(20) NOT NULL,
  scheduled_delivery_time TIMESTAMP NOT NULL,
  card_opened_at TIMESTAMP,
  sticker_pack_url TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pop_parties_delivery ON pop_parties(scheduled_delivery_time, status);

-- Party Members (Viewers)
CREATE TABLE party_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_party_id UUID REFERENCES pop_parties(id),
  user_id UUID REFERENCES users(id),
  phone_number VARCHAR(20) NOT NULL,
  invitation_token VARCHAR(255) UNIQUE NOT NULL,
  message_text TEXT,
  message_status VARCHAR(50) DEFAULT 'draft',
  signed_up_at TIMESTAMP,
  message_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_party_members_party ON party_members(pop_party_id);
CREATE INDEX idx_party_members_token ON party_members(invitation_token);

-- Scheduled Jobs (for Bull queue persistence)
CREATE TABLE scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(50) NOT NULL,
  job_data JSONB NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scheduled_jobs_time ON scheduled_jobs(scheduled_time, status);
```

## Error Handling

### Frontend Error Handling
- Network errors: Retry with exponential backoff (3 attempts)
- AI generation timeout: Display friendly message, offer template fallback
- Payment failures: Clear Stripe error messages, retry option
- Canvas errors: Auto-save state, offer recovery

### Backend Error Handling
- AI service failures: Fallback to alternative AI provider
- NeoCurrency API errors: Cache catalog, graceful degradation
- Stripe webhook failures: Retry queue with dead letter queue
- SMS delivery failures: Retry up to 3 times, log for manual follow-up

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
}
```

## Testing Strategy

### Unit Testing
- **Frontend**: Jest + React Testing Library for components
- **Backend**: Jest for services, agents, and utilities
- **Coverage Target**: 80% for critical paths (payment, AI orchestration)

### Integration Testing
- API endpoint testing with Supertest
- Database integration with test containers
- External API mocking with MSW (Mock Service Worker)
- Agent workflow testing with Neuro AI SDK test utilities

### End-to-End Testing
- Playwright for critical user flows:
  - Complete gift creation and purchase
  - Group gifting orchestration
  - Recipient card opening and wallet download
- Mobile device testing on iOS Safari and Android Chrome

### Performance Testing
- Load testing with k6 for 1,000 concurrent users
- AI generation latency monitoring (target: <15s)
- Database query optimization with EXPLAIN ANALYZE
- CDN caching validation for static assets

### Security Testing
- OWASP Top 10 vulnerability scanning
- Penetration testing for payment flows
- JWT token validation and expiration testing
- SQL injection and XSS prevention validation

## Performance Optimization

### Frontend Optimization
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Lazy loading for template gallery and catalog
- Service Worker for offline card preview caching
- Debounced AI prompt inputs (500ms)

### Backend Optimization
- Redis caching for:
  - NeoCurrency catalog (1 hour TTL)
  - User sessions (24 hour TTL)
  - Gift card recommendations (5 minute TTL)
- Database connection pooling (max 20 connections)
- Batch processing for sticker pack generation
- CDN for card images and static assets
- Horizontal scaling with load balancer for API servers

### AI Optimization
- Parallel generation of 3 card previews
- Image compression before storage (WebP format)
- GPU-accelerated inference for AI models
- Request queuing to prevent API rate limits

## Security Considerations

### Authentication & Authorization
- JWT tokens with 24-hour expiration
- Refresh tokens with 30-day expiration
- Phone number verification with 6-digit codes (5-minute expiration)
- OAuth state parameter validation for social login
- Rate limiting: 5 login attempts per 15 minutes per IP

### Data Protection
- TLS 1.3 for all client-server communication
- Encrypted database fields for sensitive data (phone numbers)
- PCI DSS compliance via Stripe (no card storage)
- GDPR compliance with data export and deletion endpoints

### API Security
- API key rotation for external services
- Webhook signature verification (Stripe, NeoCurrency)
- CORS configuration for allowed origins
- Request size limits (10MB for image uploads)
- SQL injection prevention via Prisma parameterized queries
- XSS prevention via React's built-in escaping

### Infrastructure Security
- Environment variable management (no secrets in code)
- Database backups (daily with 30-day retention)
- Audit logging for financial transactions
- DDoS protection via Cloudflare or AWS Shield

## Deployment Architecture

### Monorepo Structure
```
digital-gift-card-platform/
├── packages/
│   ├── frontend-web/          # Next.js application
│   ├── backend-api/            # Express.js monolith
│   ├── shared-types/           # TypeScript interfaces
│   └── ai-agents/              # Neuro AI agent definitions
├── infrastructure/
│   ├── docker/                 # Dockerfile and docker-compose
│   ├── kubernetes/             # K8s manifests (future)
│   └── terraform/              # Infrastructure as code
└── scripts/
    ├── db-migrate.sh
    └── deploy.sh
```

### Environment Configuration
- **Development**: Local Docker Compose with hot reload
- **Staging**: Single EC2 instance or App Platform deployment
- **Production**: Auto-scaling group with load balancer, RDS PostgreSQL, ElastiCache Redis

### CI/CD Pipeline
1. Code push triggers GitHub Actions
2. Run linting and type checking
3. Run unit and integration tests
4. Build Docker images
5. Push to container registry
6. Deploy to staging (automatic)
7. Run E2E tests on staging
8. Deploy to production (manual approval)

## Monitoring and Observability

### Metrics
- Application metrics: Request rate, error rate, latency (p50, p95, p99)
- Business metrics: Cards created, gifts purchased, conversion rate
- AI metrics: Generation time, success rate, refinement iterations
- Infrastructure metrics: CPU, memory, disk, network

### Logging
- Structured JSON logs with correlation IDs
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized logging with CloudWatch or Datadog
- Sensitive data redaction (phone numbers, payment info)

### Alerting
- PagerDuty integration for critical errors
- Slack notifications for warnings
- Alert conditions:
  - AI generation failure rate >5%
  - Payment processing errors
  - Scheduled message delivery failures
  - Database connection pool exhaustion

### Tracing
- Distributed tracing with OpenTelemetry
- Trace AI agent execution flows
- Track external API call latency
- Identify performance bottlenecks
Front-End Product Requirements Document (FPRD) - Advanced Editing Edition
This document defines the front-end requirements for the React web application, aligning with the Multi-Agent Backend Architecture and incorporating advanced editing UI patterns for Figma design and development.

1. Project Overview and Context
This section provides the essential framework for the front-end team.

Project Name: Digital Gift Card App

Target Platform: Mobile Web Responsive (Mobile First)

Framework: React/Next.js (for high-performance SPA/SSR)

Design Source: Figma File (Design will be inspired by Adobe Express and Whisk UI concepts)

Backend Status: Monolith API + Neuro AI Multi-Agent Builder (In Development)

NFR/Quality Goal: WCAG AA Compliance and Sub-15s AI Preview Load

2. Core Front-End Architecture and Constraints
The UI must be built for extensibility and integration with the Neuro AI system.

Repository Structure: Monorepo (packages/frontend-web).

Integration: Must expose API endpoints that securely relay the Layer Tree state and accept granular layer modification requests for the Neuro AI Editor Agent.

Dependencies: Must utilize libraries for high-fidelity animation (e.g., Lottie/GSAP) and a robust canvas/editing library capable of rendering, selecting, and manipulating layer data.

Primary Navigation: All core sender workflows must utilize the Top Sub-Navigation bar:

Edit: For basic text and image manipulation.

Effects: For applying styles and filters to layers.

Animation: For setting motion sequences.

Buy: For commerce and gift card attachment.

Schedule: For delivery setup and party member inclusion.

3. Detailed User Flows and Feature Requirements (FRs)
The user experience is defined by a primary Sender Funnel and a simplified Recipient Experience.

Flow A: The Sender's Journey (Card Creation & Editing)
Screen A1: Authentication & Contact Access
Goal: Secure entry and contact list permission.

Login Priority: Primary action must be Phone Number login/sign-up.

Initial Action: Upon successful login, display a Native-style Permission Modal requesting access to the Mobile Contacts List.

Screen A2: Card Creation Input (Madlib & Templates)
Base UI: Single, central text input field at the bottom for the initial prompt (Madlib style).

Interaction: "DESIGN CARD" Button: Replaces the generic "add images" concept. Clicking this opens a full-screen modal to gather detailed inputs for the Illustrator Agent:

Recipient Name (text input).

Message (text input, e.g., "I wish you a happy 30th Birthday!").

Style (text input, with an integrated image icon to choose style templates).

Template Gallery: Below the main prompt input, a vertically scrolling gallery of pre-designed templates is available. Choosing a template loads its design directly to the editing canvas.

Screen A3: Preview, Refinement, and Selection
AI Output: Displays three high-fidelity card design previews and three recommended gift cards (from the Shopper Agent).

Refinement Prompt: The bottom text input serves as the Refinement Prompt Window. Users can type new prompts (e.g., "change the background color to neon") and hit the arrow button to re-generate the three previews.

Action: Selecting a card preview transitions directly to the editing canvas (Screen A4).

Screen A4: Granular Card Editing (The Canvas)
Core Feature: The entire screen is a live, complex editing canvas.

Top Sub-Navigation: Controls the primary function of the app (Edit, Effects, Animation, Buy, Schedule).

Layer Interaction (Core Requirement):

Tapping any layer (text, image, shape) on the canvas displays edit handles around it.

The interface must include a Layer Tree (e.g., in a right-hand panel) that lists all elements, including animation instructions.

Bi-Directional Select: Clicking a layer on the canvas highlights its entry in the Layer Tree, and vice-versa.

Multi-Select: Users must be able to select multiple layers simultaneously.

"Edit" Tab (Layer Focus):

Text Layers: Selecting invokes a keyboard for direct text editing. A button is available to generate new text layers.

Image/Shape Layers: Selecting brings up the AI Prompt Box for the Editor Agent, with defaults like "remove background," "make it pink," or "delete layer".

"Effects" Tab: Displays style-related effects like text effects (shadow, glow) and image filters to update the style of layers.

"Animation" Tab: Displays animation presets (e.g., "Pop," "Spin," "Flicker"). A timeline control allows users to sequence animations and adjust timing. Users can type changes they'd like to see of the animation sequence.

Preview: A "Preview Card" button simulates the animated card reveal with sound effects.

Screen A5: Buy (Checkout and Gift Card Selection)
Entry: Accessed via the "Buy" tab in the top sub-nav.

Gift Card: Confirms the recommended card or allows search of the full NeoCurrency catalog.

Checkout: Displays the final costs ($1.00 card fee, face value gift card, tax). Payment via Stripe (Credit Card, Apple Pay, Google Pay).

Screen A6: Schedule (Delivery and Invitee Setup)
Entry: Accessed via the "Schedule" tab in the top sub-nav.

Inputs: Fields for Recipient Name and Recipient Phone Number are mandatory.

Viewers (Party Members): A separate workflow allows adding Viewer phone numbers (other friends) who will be included in the group text chain. Uses the integrated Contacts List.

Action: Date/Time picker for Scheduling the Gift Delivery. A final screen displays the copy-paste text containing the unique invitation links for the sender.

Flow B: The Recipient's Experience
Screen B2: Recipient Card Landing Page
Experience: Full-screen presentation of the Animated Card Reveal (with sound effects).

Final Action: Large, unmistakable button: "Tap to Download $[Value] for [Merchant Name]", which initiates the Apple Wallet/Google Wallet pass download sequence.

4. UI Component Inventory (Required for React Web App)
The following components must be designed for reusability within the React application:

A. Global/Navigation Components
TopSubNav (Edit, Effects, Animate, Buy, Schedule tabs)

LeftToolbar (Contextual editing controls)

RightPanel (Container for Layer Tree / AI Prompt)

ProcessingIndicator

B. Input & Flow Components
MadlibInput (Prompt input, integrated image upload icon)

DesignCardModal (Full-screen input for initial Madlib details)

StyleTemplateModal

ContactSelector (Integrated with phone contacts list)

DateTimePicker

CopyPasteMessageDisplay

C. Canvas & Editor Components
FullCardCanvas (Complex canvas component for rendering and interaction)

LayerTreePanel (Displays and manages the Layer Tree)

AIPromptBox (Text input field for AI refinement)

TextEditingToolbar (Font, size, color controls)

AnimationPanel (Presets, timeline control)

EffectsPanel (Filters and styles)

D. Commerce & Delivery Components
GiftCardPreview (Small tile/selection component)

GiftCardCatalogSearch (Search bar/modal for NeoCurrency API)

StripeCheckoutForm (Wrapper for payment processing)

WalletDownloadButton (The CTA on the recipient page)

StickerSelector (For the Invitee Party Page)

RecipientCardRenderer (The final animated view with sound).