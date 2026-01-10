# Requirements Document

## Introduction

The Digital Gift Card Platform is a mobile-first web application that transforms traditional gift-giving into a seamless, personalized digital experience. The system enables users to create AI-generated custom greeting cards, attach real cash-value gift cards, and orchestrate group gifting experiences through native messaging applications. The platform integrates with NeoCurrency for gift card fulfillment, Stripe for payments, and supports Apple Wallet and Google Wallet for recipient redemption.

## Glossary

- **System**: The Digital Gift Card Platform web application and backend services
- **Sender**: The primary user who initiates and purchases the gift card experience
- **Recipient**: The person who receives the digital gift card and animated card
- **Viewer**: A party member invited by the Sender to contribute messages to the group gift
- **Madlib Prompt**: A guided text input form collecting recipient details (name, occasion, age, interests, style preferences)
- **Layer Tree**: The JSON data structure representing all visual elements (text, images, shapes) of a card design
- **Pop Party**: A coordinated group gifting experience with multiple contributors
- **NeoCurrency API**: The third-party service providing the gift card catalog and fulfillment
- **Wallet Pass**: A digital pass compatible with Apple Wallet or Google Wallet containing the gift card value
- **AI Card Agent**: The backend multi-agent system responsible for generating and editing card designs
- **Sticker Pack**: A custom, themed collection of digital stickers generated for party members

## Requirements

### Requirement 1: User Authentication and Profile Management

**User Story:** As a user, I want to securely sign in using my phone number or social accounts, so that I can access the platform and manage my gifting activities.

#### Acceptance Criteria

1. WHEN a user accesses the System, THE System SHALL present authentication options for phone number, Apple ID, and Google account
2. WHEN a user completes phone number authentication, THE System SHALL send a verification code via SMS within 10 seconds
3. WHEN a user successfully authenticates, THE System SHALL create or update a user profile with the provided credentials
4. WHEN a user authenticates via Apple or Google, THE System SHALL synchronize profile data from the VCard format
5. THE System SHALL store user credentials using industry-standard encryption (TLS 1.3 or higher)

### Requirement 2: Contact List Integration

**User Story:** As a Sender, I want to grant access to my mobile contacts, so that I can easily select recipients and party members for group gifts.

#### Acceptance Criteria

1. WHEN a user completes authentication, THE System SHALL request permission to access the device's contact list
2. IF the user grants contact permission, THEN THE System SHALL retrieve and cache the contact list data
3. THE System SHALL display contact names and phone numbers in selection interfaces for recipient and party member assignment
4. THE System SHALL respect the user's privacy settings and only access contacts when explicitly permitted

### Requirement 3: AI Card Generation from Madlib Input

**User Story:** As a Sender, I want to describe my gift idea using a guided prompt, so that the AI can generate personalized card designs for my recipient.

#### Acceptance Criteria

1. THE System SHALL present a Madlib Prompt input field with placeholders for recipient name, occasion, age, interests, and style preferences
2. THE System SHALL provide an image upload button within the prompt interface to accept recipient photos
3. WHEN a user submits a complete Madlib Prompt, THE System SHALL invoke the AI Card Agent to generate three card design previews
4. THE System SHALL complete the card generation process and display previews within 15 seconds of prompt submission
5. WHEN generation completes, THE System SHALL display three distinct card design options to the user

### Requirement 4: Template Gallery Selection

**User Story:** As a Sender, I want to browse pre-designed card templates, so that I can quickly select a design without using AI generation.

#### Acceptance Criteria

1. THE System SHALL display a scrollable gallery of pre-designed card templates below the Madlib Prompt input
2. WHEN a user selects a template, THE System SHALL load the template's Layer Tree into the card editor
3. THE System SHALL allow users to proceed directly to editing without AI generation when a template is selected

### Requirement 5: Design Refinement and Preview

**User Story:** As a Sender, I want to refine AI-generated card designs using text prompts, so that I can adjust the design before detailed editing.

#### Acceptance Criteria

1. WHEN the System displays three card previews, THE System SHALL present a refinement prompt input field
2. WHEN a user submits a refinement prompt, THE System SHALL regenerate the three card previews based on the new instructions within 15 seconds
3. THE System SHALL allow users to target specific card previews for refinement by selecting them before submitting a prompt
4. WHEN a user selects a card preview, THE System SHALL transition to the granular editing interface with the selected design loaded

### Requirement 6: Granular Card Editing with Layer Manipulation

**User Story:** As a Sender, I want to directly edit text, colors, and shapes on my card, so that I can achieve pixel-perfect customization.

#### Acceptance Criteria

1. THE System SHALL render the selected card design on an interactive canvas with selectable layers
2. WHEN a user taps a layer element, THE System SHALL display editing controls appropriate to the layer type (text, image, or shape)
3. WHILE a text layer is selected, THE System SHALL provide controls for font, size, color, bold, italic, underline, and alignment
4. WHILE an image layer is selected, THE System SHALL provide controls for cropping, resizing, and mask generation
5. THE System SHALL allow users to add new text layers and image layers via dedicated buttons
6. THE System SHALL allow users to delete selected layers via a delete control
7. THE System SHALL maintain the Layer Tree data structure and synchronize it with all visual changes

### Requirement 7: AI-Assisted Layer Editing

**User Story:** As a Sender, I want to use AI prompts to modify specific card elements, so that I can make complex edits without manual manipulation.

#### Acceptance Criteria

1. THE System SHALL display a persistent AI prompt input field within the editing interface
2. WHEN a user selects a layer element, THE System SHALL pre-fill the AI prompt field with the element's name and context
3. THE System SHALL display three recommended AI prompt suggestions as tooltips to guide the user
4. WHEN a user submits an AI editing prompt, THE System SHALL invoke the AI Card Agent to modify the targeted layer and update the Layer Tree within 10 seconds
5. THE System SHALL render the updated design on the canvas immediately after AI processing completes

### Requirement 8: Visual Effects and Animation

**User Story:** As a Sender, I want to apply visual effects and animations to my card, so that the recipient experiences a delightful reveal.

#### Acceptance Criteria

1. THE System SHALL provide an Effects panel with text effects (shadow, glow, lift, hazy) and image filters
2. THE System SHALL provide an Animation panel with preset animation sequences (typewriter, pop, spin, confetti burst)
3. WHEN a user applies an effect or animation, THE System SHALL update the Layer Tree with the effect configuration
4. THE System SHALL provide a timeline control for adjusting animation timing and audio integration
5. THE System SHALL provide a Preview Card function that simulates the animated card reveal with sound effects

### Requirement 9: Gift Card Recommendation and Selection

**User Story:** As a Sender, I want to receive gift card recommendations based on my recipient's interests, so that I can choose an appropriate gift.

#### Acceptance Criteria

1. WHEN the System generates card previews, THE System SHALL invoke the Shopper Agent to recommend three relevant gift cards based on the Madlib Prompt data
2. THE System SHALL display the three recommended gift cards with merchant names and logos
3. THE System SHALL provide a search interface to access the full NeoCurrency catalog of 1,500+ merchants
4. WHEN a user selects a gift card, THE System SHALL allow the user to assign a cash value amount
5. THE System SHALL validate the selected gift card and cash value with the NeoCurrency API before proceeding to checkout

### Requirement 10: Secure Payment Processing

**User Story:** As a Sender, I want to securely pay for my gift card and card fee, so that I can complete my purchase with confidence.

#### Acceptance Criteria

1. THE System SHALL display a checkout cart breakdown showing the $1.00 card fee, gift card face value, and applicable tax
2. THE System SHALL integrate with Stripe to process credit card, Apple Pay, and Google Pay payments
3. THE System SHALL use TLS 1.3 encryption for all payment data transmission
4. THE System SHALL not store raw credit card numbers and SHALL delegate all payment processing to Stripe
5. WHEN payment is successful, THE System SHALL receive a Stripe charge ID and proceed to gift orchestration

### Requirement 11: Group Gifting Orchestration

**User Story:** As a Sender, I want to invite party members to contribute messages to my gift, so that we can create a collaborative gifting experience.

#### Acceptance Criteria

1. THE System SHALL provide contact selection fields for the Recipient and multiple Viewer phone numbers
2. WHEN a Sender adds Viewers, THE System SHALL generate unique sign-up URLs for each Viewer
3. THE System SHALL generate copy-paste invitation text containing all unique Viewer links for the Sender to share
4. THE System SHALL create a Pop Party record associating the card, Recipient, and all Viewers

### Requirement 12: Custom Sticker Pack Generation

**User Story:** As a Viewer, I want to receive a custom sticker pack themed to the gift occasion, so that I can use it in my messages.

#### Acceptance Criteria

1. WHEN a Pop Party is created, THE System SHALL automatically generate a custom sticker pack styled to the recipient's occasion and card theme
2. THE System SHALL make the sticker pack available for download on the Party Page
3. THE System SHALL format the sticker pack for compatibility with native mobile keyboard integration

### Requirement 13: Gift Delivery Scheduling

**User Story:** As a Sender, I want to schedule when my gift is delivered, so that it arrives at the perfect moment.

#### Acceptance Criteria

1. THE System SHALL provide a date and time picker for scheduling gift delivery
2. WHEN the scheduled delivery time arrives, THE System SHALL invoke the Scheduling Assistant Agent to send the gift link via SMS
3. THE System SHALL send the gift link to the Recipient's phone number via the Messaging API
4. THE System SHALL include all Viewers in the message thread to create a group conversation

### Requirement 14: Viewer Message Contribution

**User Story:** As a Viewer, I want to draft a personalized message that sends after the recipient opens the card, so that I can add my personal touch to the group gift.

#### Acceptance Criteria

1. WHEN a Viewer accesses their unique sign-up link, THE System SHALL authenticate the Viewer and display the Party Page
2. THE System SHALL display the finalized card design and provide a message input field for the Viewer
3. THE System SHALL provide access to the custom sticker pack for inline use in the Viewer's message
4. THE System SHALL schedule the Viewer's message to send only after the Recipient opens the card link
5. WHEN the Recipient opens the card, THE System SHALL trigger delivery of all pending Viewer messages via the Messaging API

### Requirement 15: Recipient Card Experience and Wallet Integration

**User Story:** As a Recipient, I want to view an animated card reveal and download my gift card to my mobile wallet, so that I can enjoy the gift and easily redeem it.

#### Acceptance Criteria

1. WHEN a Recipient taps the gift link, THE System SHALL load a full-screen animated card reveal with sound effects
2. THE System SHALL automatically play the card animation upon page load
3. WHEN the animation completes, THE System SHALL display a prominent download button labeled with the gift card value and merchant name
4. WHEN the Recipient taps the download button, THE System SHALL generate an Apple Wallet or Google Wallet pass using the NeoCurrency pass data
5. THE System SHALL initiate the native wallet pass download sequence for the Recipient's device
6. WHEN the Recipient opens the card, THE System SHALL record a "Card Opened" event to trigger Viewer message delivery

### Requirement 16: Product-Based Gift Cards with Shopping Personas

**User Story:** As a Sender, I want to recommend specific products from retailers like Amazon or Walmart, so that I can create a tailored gift card for that exact item.

#### Acceptance Criteria

1. THE System SHALL integrate with a knowledge graph backend to create shopping personas based on recipient interests
2. THE System SHALL allow Senders to search for and select specific products from Amazon and Walmart catalogs
3. WHEN a Sender selects a product, THE System SHALL calculate the gift card amount including product price, tax, and shipping
4. THE System SHALL generate a product-specific gift card that pre-loads the selected item in the Recipient's cart upon redemption
5. WHEN a Recipient redeems a product-specific gift card, THE System SHALL provide the option to checkout with the pre-loaded item or convert to cash value
6. THE System SHALL capture shopping behavior data for analytics purposes while respecting user privacy

### Requirement 17: System Performance and Scalability

**User Story:** As a platform operator, I want the system to handle high concurrent usage, so that all users experience fast, reliable service.

#### Acceptance Criteria

1. THE System SHALL complete AI card generation and display previews within 15 seconds of prompt submission
2. THE System SHALL complete AI layer editing and display updates within 10 seconds of prompt submission
3. THE System SHALL support at least 1,000 concurrent gift-sending orchestrations without performance degradation
4. THE System SHALL maintain response times under 2 seconds for all non-AI API endpoints under normal load

### Requirement 18: Mobile-First Responsive Design

**User Story:** As a mobile user, I want the application to work seamlessly on my phone's browser, so that I can create and send gifts on the go.

#### Acceptance Criteria

1. THE System SHALL render all user interfaces with mobile-first responsive design principles
2. THE System SHALL provide touch-optimized controls for all interactive elements
3. THE System SHALL maintain WCAG AA accessibility compliance across all screens
4. THE System SHALL function correctly on modern mobile browsers (iOS Safari, Chrome, Android Chrome)

Digital Gift Card App Product Requirements Document (PRD)

Additional feature requirements: 
Knowledge graph of backend to create shopping personas for gifting Neo4J
Gift cards based on products: Create gifting for amazon, Walmart where the user can recommend an item (tailored) a gift card is generated for that amount with tax, shipping and then the user on click has the cart loaded. User may choose to checkout or keep cash value. Helpful for retailers as it stops returns, but creates a thoughtful digital gift experience. Also tells us valuable shopping data about purchasing behavior.


1. Goals and Background Context


Goals

FR-Goal-1: Deliver a complete, thoughtful, and highly personalized digital gift-giving experience on mobile platforms.
FR-Goal-2: Leverage AI design tools to create custom digital cards that achieve the same emotional gravitas as high-quality physical cards.
FR-Goal-3: Establish a highly convenient process for coordinating group gifting directly within existing mobile messaging threads.
FR-Goal-4: Integrate securely with a third-party API (NeoCurrency) to deliver digital gift cards with real cash value and full Apple Wallet/Google Wallet compatibility.
FR-Goal-5: Replace the cumbersome, slow physical mail gifting process with a seamless, digital-first experience that is aligned with the connected age.

Background Context

The current paradigm for meaningful gifting, which often relies on physical cards sent via mail, is viewed as cumbersome and outdated by today's digitally native users. This app aims to solve this by making thoughtful, personalized gift-giving an exciting, simple, and native experience within the digital space. The primary audience consists of busy professionals and young adults who seek to express thoughtfulness to their loved ones via mobile mediums.
The Minimum Viable Product (MVP) is a mobile web application focused on the end-to-end group gift flow: users will design an AI-generated card using a guided prompt ("madlib"), attach a real-cash-value gift card from the NeoCurrency catalog, and orchestrate the group sending process directly within a text message thread. The gift card must be compatible for seamless addition to both Apple Wallet and Google Wallet.

Change Log



2. Requirements


Functional Requirements (FR)

FR1: AI Card Generation Input (Madlib Style): The system must present a guided "madlib" input form (fields for user name, occasion, age, recipient likes, desired style) and allow the user to upload a recipient image to guide the AI card design.
FR2: Template Gallery: The user must be able to scroll through a gallery of card design templates as an alternative to the AI prompt.
FR3: AI Output & Refinement: The system must generate a preview of three custom card designs and allow the user to submit refinement prompts to re-generate the designs before selection.
FR4: Granular Card Editing: The system must provide a dedicated editorial tool post-design selection, allowing the user to directly edit text layers, colors, and shapes.
FR5: AI-Assisted Editing: The editing tool must include an AI prompt box that can manipulate elements chosen via a click interface, along with tool tip suggestions.
FR6: Gift Card Selection & Recommendations: The system must recommend three relevant gift cards based on the prompt/likes, and allow the user to search an extended catalog of 1,500+ merchants via a sidebar.
FR7: Gift Card Purchase & Value Assignment: The system must interface with the NeoCurrency API to allow the sender to assign a cash value and purchase the selected gift card.
FR8: Payment Gateway & Checkout: The system must manage a secure checkout process via Stripe(supporting Credit Card, Apple Pay, and Google Pay), displaying a breakdown of the $1.00 card fee, face-value gift card cost, and tax.
FR9: Group Gifting Invitation Orchestration: The system must generate a unique, person-specific sign-up link and clear copy-paste invitation text for each invited party member.
FR10: Personalized Sticker Pack Generation: The system must automatically generate a custom, downloadable sticker pack (for keyboard use) styled to the recipient's occasion for all invited party members upon sign-up.
FR11: Messaging Thread Management: The system must enable the orchestration of a persistent group text message thread in the user's native messaging app (iMessage/Android) that includes the recipient and all party members.
FR12: Scheduling & Delayed Messaging: The system must allow the sender to schedule the primary gift delivery, and allow party members to schedule their messages to send after the recipient opens the card link.
FR13: Recipient Experience & Wallet Integration: The recipient must tap a unique link to view an animated card reveal with sound effects, and then be able to download the gift card directly to their Apple Wallet or Google Wallet.
FR14: Authentication & Profile Sync: The system must support social login (Apple, Google) and prioritize Phone Number as a login credential, with support for profile syncing via Apple VCard.

Non Functional Requirements (NFR)

NFR1: Performance - AI Generation: The AI card generation preview process must complete and present a finalized image to the user within 15 seconds.
NFR2: Security - Gift Card Integrity: All transactions and gift card data transfer via the NeoCurrency API and Stripe must use industry-standard encryption (e.g., TLS 1.3) to protect the cash value.
NFR3: Scalability - Messaging Load: The backend system must be able to handle at least 1,000 concurrent gift-sending orchestrations without performance degradation.
NFR4: Usability - Mobile First: The web application UI/UX must be fully responsive and optimized for a seamless experience on all modern mobile phone browsers.


3. User Interface Design Goals



4. Technical Assumptions



5. Epic List



6. Epic Details


Epic 1: Foundation & Core Identity


Epic 2: Card Creation & Core Commerce


Epic 3: Gifting Orchestration & Delivery



7. Checklist Results Report

Validation of the PRD against the "Product Requirements Document" template criteria:

Summary: The PRD is complete, consistent, and provides all necessary detail for the next phases of the workflow. The Project is ready for handoff.

I will now proceed as the UX Expert to create the Front-End Specification based on the detailed Product Requirements Document (PRD).


Digital Gift Card App Front-End Specification (front-end-spec.md)

Date: {{current_date}}
Author: UX Expert Agent
Based on: prd.md (Version 1.0)
Goal: To define the mobile-first user interface (UI) and user experience (UX) for the MVP, with a focus on seamless AI card creation, granular editing, and secure gift delivery orchestration.


1. UI/UX Vision and Constraints


Vision Statement

The experience must feel like a modern, delightful, and magical guided funnel. It must transform the complexity of AI generation and group messaging into a simple, high-fidelity "Pop Party" experience. The design will be mobile-first and highly responsive to ensure a native-like experience within a mobile web browser.

Design Constraints and Goals



2. Core User Flows and Screen Specifications


Flow A: The Sender's Journey (Card Creation & Purchase)

The user is guided through a mandatory, sequential six-step funnel.

Screen A1: Authentication & Contact Access (Epic 1.2, 1.3)

Purpose: Secure entry and contact list permission.
Interaction: Primary action is Phone Number login/sign-up. Secondary buttons for Apple/Google Social Login.
UI Focus: Immediately upon successful login, a clear, native-OS-style modal requests permission to Access Mobile Contacts List for party inviting.

Screen A2: Card Creation Input (Madlib & Templates) (Epic 2.1)

Purpose: Gather creative inputs for the AI agent.
Interaction: Features a single, prominent text input field at the top for the AI "Madlib" Prompt (Name, Occasion, Likes, Style) with placeholders fading in/out.
UI Focus: A clear "Upload Image" button is integrated into the prompt field. Below the prompt, a long-scrolling gallery of Design Templates is displayed, each with a small preview card.

Screen A3: Design Preview, Refinement, and Selection (Epic 2.2)

Purpose: Review AI options and refine the design before detailed editing.
Interaction: Displays three high-fidelity card design previews. Directly below these, three recommended gift cards are shown.
UI Focus: A Refinement Prompt window is pinned to the bottom of the mobile screen. Users can type new prompts to re-generate the three previews, or select one card to target it for refinement. The fourth option for gift cards is an icon/sidebar trigger for the Full Catalog Search.

Screen A4: Granular Card Editing (Epic 2.3, 2.4)

Purpose: Final, pixel-perfect customization of the chosen card.
Interaction:
Direct Edit: Card elements (text, shapes, color blocks) are selectable. Clicking an element opens a floating modal for direct text/color input changes.
AI Edit Prompt: A dedicated AI prompt field is persistent. Clicking an element highlights it and pre-fills the AI prompt box with the element's name/context (e.g., "Image layer of Tyler's face").
Tooltips: Three recommended AI prompt suggestions appear as tool tips to teach the user the AI editing capability.
Visual Elements: A 'Preview Card' button simulates the animated card reveal (with sound effects) as the recipient will see it.
Handoff: The 'Publish' button locks the design and moves to the purchase flow.

Screen A5: Checkout and Signatures (Epic 2.5, 2.6)

Purpose: Finalize payment and apply signatures.
UI Focus: Prominent Checkout Cart displaying the mandatory breakdown: $1.00 card fee, $XX.XX face value gift card, + tax.
Payment: Dedicated buttons/fields for Stripe Credit Card, Apple Pay, and Google Pay.
Signatures: A section allows the user to edit the names/nicknames on the 'From' line for the card and input a final message.

Screen A6: Group Setup & Scheduling (Epic 3.2, 3.3)

Purpose: Orchestrate the group gift and set the delivery time.
Interaction: Dedicated fields/selectors using the integrated Contacts List (Epic 1.3) to select all party members and the recipient.
UI Focus: A clear date/time picker for Scheduling the Gift Delivery. Displays the copy-paste text that must be sent to the native messaging app, containing all unique invitation links.


Flow B: The Invitee/Recipient Journey


Screen B1: Invitee Sign-up & Party Page (Epic 1.2, 3.4)

Purpose: Onboarding the invitee and facilitating their contribution.
Interaction: The unique invitation link takes the user to a dedicated sign-up page (Phone Number/Social Login).
UI Focus: After login, the user lands on the Party Page. They can view the finalized card and are prompted to Draft a Congratulatory Message. The interface includes a sticker selector to use the custom, themed Sticker Pack inline. A separate, clear button is provided to download the sticker packto the native phone keyboard.
Scheduling: A clear confirmation states: "Your message is scheduled to send after [Recipient Name] opens the card on [Scheduled Date].".

Screen B2: Recipient Card Landing Page (Epic 3.5)

Purpose: The final moment of surprise and delight.
Visuals: Full-screen presentation of the Animated Card Reveal (music/sound effect starts automatically, e.g., trumpets/confetti).
UI Focus: After the animation completes, the primary CTA (Call to Action) appears: a large, unmistakable button labeled "Tap to Download $[Value] for [Merchant Name]". This button initiates the Apple Wallet/Google Wallet pass download sequence.


3. High-Level Wireframe Overview

The application utilizes a Mobile-First Single-Page Application (SPA) architecture approach for the user funnel (Flow A).
Header: Fixed header across all funnel screens showing the step number (e.g., "Step 3 of 6: Design") and a "Pop Gifts" logo.
Main Content: Vertically scrolling, content-focused sections designed for mobile tapping and input.
Footer: Contextual bottom navigation (e.g., "Next Step" or the Pinned Refinement Prompt).
Recipient Page (Flow B2): This is a stripped-down, minimal page optimized for immediate visual impact and the single "Download to Wallet" action.

I am now operating as the Architect. Based on the Product Requirements Document (PRD) and the Front-End Specification, I will create the Full-Stack Architecture Document (fullstack-architecture.md).
This architecture is constrained by the required Monorepo structure and Monolith service model, focusing on secure, high-performance integration of the critical commerce and AI services.


Digital Gift Card App Full-Stack Architecture (fullstack-architecture.md)

Date: {{current_date}}
Author: Architect Agent
Based on: prd.md, front-end-spec.md
Goal: Define the technical structure, components, data flow, and security layers to successfully implement the "Digital Gift Card App" MVP.


1. High-Level Architecture Decision



2. Core Service Components

The Monolith will be structured into three logical layers: Presentation, API/Business Logic, and External Service Integrations.


3. Data Model Design (Simplified)


Core Entities

User: user_id, phone_number (Unique Index), social_id (Apple/Google), profile_data (JSONB for VCard/Contact Sync Status).
Card_Design: card_id, prompt_log (JSONB, for AI editing/refinement history), final_image_url, animation_config (JSONB, for sound/confetti details).
Gift_Transaction: transaction_id, sender_id, recipient_id, gift_card_value, stripe_charge_id, neocurrency_pass_id (Critical cross-API link for tracing financial data).
Pop_Party: party_id, card_id (FK), scheduled_delivery_time.
Party_Member: party_member_id, pop_party_id (FK), phone_number, message_text, message_status(Draft, Scheduled, Delivered, Post-Open).




5. Front-End Technical Design (Web App)


Technology Stack

Framework: React/Next.js (for server-side rendering/mobile optimization).
Styling: Tailwind CSS (for rapid, responsive, mobile-first design).
Animation: Use a library like Lottie or GSAP to handle the high-fidelity Animated Card Reveal (Epic 3.5), ensuring smooth performance (NFR4).

Key Front-End Components

Card Editor Component: A complex component for the Granular Card Editing (Epic 2.3). It must use a canvas or similar technology to allow direct manipulation of text/color layers, overlaid with the interactive AI Prompt box for refinement.
Gifting Funnel Router: Manages the six-step guided user flow (Screen A1-A6), ensuring state persistence across steps.
Wallet Download Page: A minimal client-side component (Screen B2) that displays the final card animation and initiates the Wallet Pass download immediately via the pass URL generated by the Backend's Wallet Pass Generator.



___
📝 Digital Gift Card App Full-Stack Architecture (fullstack-architecture.md) - Multi-Agent System Detail

Date: {{current_date}}
Author: Architect Agent
Based on: PRD, Front-End Spec, Neuro AI SDK Integration
Goal: Define the Multi-Agent system structure, workflow, and data exchange to implement the high-fidelity AI card creation and gifting orchestration, ensuring the system is architected for future agent improvements and additions.


1. Architectural Foundation and Constraints



2. The Neuro AI Multi-Agent System

The core of the backend is the Multi-Agent Builder team, which executes the entire creative and commerce logic upon receiving the user's prompt and actions from the front-end. The system is managed by one central Orchestration Agent, coordinating four specialized, goal-oriented agents.

A. The Orchestration Agent (Manager)


B. Specialized Agents (The Team)



3. Agent Execution Workflow and Data Flow

The flow is defined by the Orchestration Agent, ensuring that data is passed efficiently between specialized agents for processing.

Data Context Object (CardState)

A central, mutable data structure (CardState) is passed between agents via the Neuro AI SDK, containing the following critical elements:
madlib_input: Initial user text, image URL, style, and recipient details.
layer_tree_state: The current JSON representation of the card layers, including text, shapes, images, and animation instructions. (Updated by Illustrator and Editor).
gift_card_candidates: The ranked list of recommended gift cards. (Updated by Shopper).
schedule_metadata: Final delivery time, recipient number, and party list. (Updated by Scheduling Assistant).

Execution Sequence (Example: Initial Card Generation)

UI → Orchestration Agent: User submits the Madlib prompt (Screen A2).
Orchestration Agent → Illustrator Agent: Passes madlib_input. Illustrator generates base layers and image URL, adds them to layer_tree_state.
Orchestration Agent → Editor Agent: Passes updated layer_tree_state. Editor adds a draft salutation and checks grammar on user's message text, saving changes back to layer_tree_state.
Orchestration Agent → Shopper Agent: Passes madlib_input (Recipient Interest/Occasion). Shopper queries NeoCurrency, ranks options, and adds gift_card_candidates to the context object.
Orchestration Agent → UI: Returns the layer_tree_state (for preview) and gift_card_candidates (for display) to the front-end (Screen A3).

Execution Sequence (Example: User Refinement Loop)

UI → Orchestration Agent: User submits refinement prompt (e.g., "make background pink") and the current layer_tree_state.
Orchestration Agent → Editor Agent: Passes prompt and layer_tree_state. Editor performs the specific layer manipulation (e.g., changes shape color), saves the updated layer_tree_state, and returns to the Orchestrator.
Orchestration Agent → UI: Returns the newly updated layer_tree_state for immediate front-end rendering.


4. External API Integration and Security

All external APIs are essential for the MVP's commerce and AI functionality. The Monolith acts as a secure proxy, ensuring NFRs are met.

Security and Compliance (NFR2)

Payment & Financial Data: The system must not store raw credit card numbers (PCI compliance). All payment processing is delegated to Stripe, which returns a charge ID/token only.
Transport Security: All communication between the front-end, back-end, and all external APIs (Stripe, NeoCurrency, AI Image Service, Neuro AI SDK, Messaging API) must use TLS 1.3 or higher.
Access Control: All Gifting Pipeline Service endpoints require validated user authentication tokens (Epic 1.2).

Key Integration Points



Front-End Product Requirements Document (FPRD) - Advanced Editing Edition


1. Project Overview and Context



2. Core Front-End Architecture and Constraints

The front-end must adhere to the Monorepo structure and integrate seamlessly with the monolithic backend API, which now houses the Neuro AI Multi-Agent system.
Repository Structure: All front-end code (React/Next.js) must reside in a dedicated workspace (e.g., packages/frontend-web) within the main Monorepo.
Design System: Components must be broken down into reusable elements.
API Contract: The UI must be built around consuming well-defined, secure endpoints for: Authentication, AI Prompting, Gift Card Catalog data, Stripe Checkout, and crucially, API endpoints that expose the Layer Tree state for the Editor Agent and accept granular layer modification requests.
Dependencies: Must integrate libraries capable of high-fidelity animation (e.g., Lottie/GSAP) and a robust canvas/editing library that can render, select, manipulate, and expose layer data for the complex editor (e.g., Konva.js, React-Three-Fiber for more complex 3D text/elements, or a custom canvas implementation).


3. Detailed User Flows and Feature Requirements (FRs)

The application features a core Creator/Sender Funnel (Screens A1-A6) and a Recipient Experience (Screen B2). The editing experience is now significantly enhanced.


Flow A: The Sender's Journey (Card Creation & Purchase)


Screen A1: Authentication & Contact Access (Epic 1.2, 1.3)

Purpose: Secure entry and contact list permission.
Interaction: Primary action: Phone Number login/sign-up. Secondary: Apple/Google Social Login.
UI Focus: Immediately upon successful login, a clear, native-OS-style modal requests permission to Access Mobile Contacts List.

Screen A2: Card Creation Input (Madlib & Templates) (Epic 2.1)

Purpose: Gather creative inputs for the AI agent, or select a template.
Base UI: (Inspired by Image 1, but adapted for mobile prompt-first). A central text input field at the bottom ("Describe your idea or roll the dice for prompt ideas").
Interaction: The "ADD IMAGES" button is replaced with "DESIGN CARD".
Modal (Inspired by Whisk Image 2 concept): Clicking "DESIGN CARD" opens a full-screen modal to gather:
Recipient Name (text input).
Message (text input, e.g., "I wish you a happy 30th Birthday!").
Style (text input, with an integrated image icon opening another modal to choose from a series of visual style templates).
Template Gallery: Below the main prompt input on the primary screen, a long-scrolling gallery of pre-designed templates (similar to Adobe Express left sidebar in Image 1 showing 'Templates'). Clicking a template loads its design into the editing canvas, skipping the AI generation step.
Action: The modal has a "MAKE MY CARD" button.

Screen A3: Design Preview, Refinement, and Selection (Epic 2.2)

Purpose: Review AI options and refine the design before detailed editing.
Processing: After "MAKE MY CARD" or template selection, the app shows a processing indicator, then reveals the card preview(s).
Previews: Displays three high-fidelity card design previews (similar to Whisk Image 4 format). Below these, three recommended gift cards are shown.
Refinement: The text input field at the bottom (Whisk Image 1 style) serves as the Refinement Prompt Window. Users can edit this prompt and hit the arrow button to re-generate/refine the previews (sub-15s response required).
Action: Selecting a card preview (by tapping) automatically transitions to Screen A4: Granular Card Editing with the chosen card loaded. The fourth option for gift cards is an icon/sidebar trigger for the Full Catalog Search.

Screen A4: Granular Card Editing (Epic 2.3, 2.4)

Purpose: Final, pixel-perfect customization of the chosen card, using a professional editing interface.
Overall Layout (Inspired by Adobe Express Images 1, 3, 4, 5):
Main Canvas: The chosen card design is displayed prominently in the center, acting as a live editing canvas.
Top Sub-Navigation: A clear, persistent sub-nav bar at the top with distinct tabs: "Edit", "Effects", "Animation", "Buy", and "Schedule". This replaces the old step-by-step funnel.
Contextual Left Toolbar: A dynamic left-hand toolbar (similar to Adobe Express left panel) changes content based on the selected tab in the top sub-nav, or the selected layer on the canvas.
Layer Tree / AI Prompt Panel (Right-Hand Side, inspired by Adobe Express right panel concept combined with Whisk Image 3): This panel shifts dynamically. When no layers are selected, it may show general AI refinement prompts. When a layer is selected, it shows the Layer Tree (as per previous spec) and layer-specific AI prompt input.
Interaction Modes (via Top Sub-Nav):
"Edit" Tab (Inspired by Image 3):
Layer Interaction: Tapping any layer on the canvas displays edit handles around it.
Left Toolbar (Text Focus): If a text layer is selected, the left toolbar shows text-specific options: font, size, color, bold, italic, underline, alignment.
Left Toolbar (Image Focus): If an image layer is selected, options for cropping, resizing, or mask generation appear.
Right Panel (Layer Tree & AI): Displays the Layer Tree. The AI prompt box is visible. Clicking an element on the canvas highlights its layer in the tree, and pre-fills the AI prompt box with the element's name/context for targeted AI editing.
Adding Layers: Buttons for "Add Text" (generates a new text layer), "Add Image" (opens upload modal) are present in the left toolbar.
Deleting Layers: A delete icon appears on selected layers or in the contextual toolbar.
"Effects" Tab (Inspired by Image 5):
Left Toolbar: Displays style-related effects: text effects (shadow, glow, lift, hazy), image filters, and shape color palettes.
Interaction: Users can apply effects globally or to selected layers.
Right Panel: The AI prompt box can be used to describe effects (e.g., "Make the text look like glass").
"Animation" Tab (Inspired by Image 4):
Left Toolbar: Displays predefined animation sequences (e.g., "Typewriter" for text, "Pop" for images, "Spin" for shapes, "Confetti burst").
Timeline: A timeline control at the bottom allows users to add/remove audio and adjust layer animation timing.
Interaction: Users can apply animation presets to selected layers. The AI prompt box can refine animations (e.g., "make the candles flicker slowly").
"Buy" Tab: (Transitions to commerce view, see Screen A5)
"Schedule" Tab: (Transitions to scheduling view, see Screen A6)
Preview Card: A prominent "Preview Card" button (or similar) within the editing interface (perhaps at the top, like Adobe Express's 'Share' or 'Play' icon) simulates the animated card reveal with sound effects, as the recipient will see it.

Screen A5: Checkout & Gift Card Selection (Epic 2.5, 2.6)

Purpose: Finalize payment and apply signatures, within the "Buy" sub-navigation.
UI Focus: Prominent Checkout Cart displaying the mandatory breakdown: $1.00 card fee, $XX.XX face value gift card, + tax.
Gift Card Selection: This screen allows the user to confirm the recommended gift card or search the full NeoCurrency catalog (via a persistent search bar/sidebar toggle).
Payment: Dedicated buttons/fields for Stripe Credit Card, Apple Pay, and Google Pay.
Signatures: A section allows the user to edit the names/nicknames on the 'From' line for the card and input a final message.

Screen A6: Group Setup & Scheduling (Epic 3.2, 3.3, 3.4)

Purpose: Orchestrate the group gift and set the delivery time, within the "Schedule" sub-navigation.
Interaction: Dedicated fields/selectors using the integrated Contacts List (Epic 1.3) to select the Recipient and all Viewer (Party Member) phone numbers.
UI Focus: A clear date/time picker for Scheduling the Gift Delivery.
Handoff UI: Displays the ready-to-copy-paste invitation message containing all unique invitation links for the sender to share via their native messaging app.
Viewer Messages: For each Viewer (party member), an input field allows them to draft their personalized message for post-open delivery. The interface includes a sticker selector to use the custom, themed Sticker Pack inline.


Flow B: The Invitee/Recipient Journey


Screen B1: Invitee Sign-up & Party Page (Epic 1.2, 3.4)

Purpose: Onboarding the invitee and facilitating their contribution.
Interaction: The unique invitation link takes the user to a dedicated sign-up page (Phone Number/Social Login).
UI Focus: After login, the user lands on the Party Page. They can view the finalized card and are prompted to Draft a Congratulatory Message. The interface includes a sticker selector to use the custom, themed Sticker Pack inline. A separate, clear button is provided to download the sticker pack to the native phone keyboard.
Scheduling: A clear confirmation states: "Your message is scheduled to send after [Recipient Name] opens the card on [Scheduled Date].".

Screen B2: Recipient Card Landing Page (Epic 3.5)

Purpose: The final moment of surprise and delight.
Visuals: Full-screen presentation of the Animated Card Reveal (music/sound effect starts automatically, e.g., trumpets/confetti).
UI Focus: After the animation completes, the primary CTA (Call to Action) appears: a large, unmistakable button labeled "Tap to Download $[Value] for [Merchant Name]". This button initiates the Apple Wallet/Google Wallet pass download sequence.


4. UI Component Inventory (for Figma Make)

This comprehensive inventory accounts for the advanced editing features, drawing inspiration from Adobe Express's structured toolsets and "Whisk's" prompt-driven interaction.
Global Components: TopSubNav (Edit, Effects, Animation, Buy, Schedule), LeftToolbar (contextual), RightPanel (Layer Tree / AI Prompt), ProcessingIndicator.
Input Components: MadlibInput (placeholder logic, integrated image upload icon), RecipientInput, MessageInput, StyleInput, PhoneNumberInput (with validation), ImageUploadButton.
Card Components: CardPreview (for the 3 options), GiftCardPreview (small tile), FullCardCanvas (the complex editor component for live manipulation).
Editor Components:
LayerTreePanel (with bi-directional selection and multi-select).
AIPromptBox (with element-focus and tool tip suggestions).
TextEditingToolbar (font, size, color, bold, italic, alignment).
ImageEditingTools (crop, resize, mask).
EffectsPanel (text effects, image filters, shape colors).
AnimationPanel (animation presets, timeline control, audio integration).
AddLayerButtons (Add Text, Add Image).
Navigation: FooterNavigation (Next/Back buttons, similar to Whisk bottom right arrow).
Specialized Components: AnimatedCardRenderer (for Epic 3.5), StickerSelector (for Invitee Party Page), GiftCardCatalogSearch (sidebar/modal).
Payment: StripeCheckoutForm (wrapper for Stripe elements), ApplePayButton, GooglePayButton.
Modals: PermissionModal (for contacts), DesignCardModal (for initial Madlib input), StyleTemplateModal.
Scheduling: DateTimePicker, ContactSelector (integrated with phone contacts), CopyPasteMessageDisplay.