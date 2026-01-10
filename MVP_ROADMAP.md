# MVP Roadmap: End-to-End Gift Flow

## Goal
Get from card design → gift card selection → SMS delivery working end-to-end as quickly as possible.

## Phase 1: Foundation (Week 1)
**Goal**: Basic infrastructure and API connections working

### Priority Tasks:
- [ ] **1.1** Set up monorepo structure (packages/frontend-web, packages/backend-api)
- [ ] **1.2** Set up Google AI connection (✅ Already configured!)
- [ ] **1.3** Set up Twilio SMS (get credentials, test sending)
- [ ] **1.4** Set up mock NeoCurrency service (use while waiting for real API)
- [ ] **1.5** Basic Express API with health check endpoint
- [ ] **1.6** Basic Next.js frontend with routing

**Deliverable**: Can call Google AI, send SMS, and mock gift cards

---

## Phase 2: Card Generation (Week 2)
**Goal**: User can create a card with AI

### Priority Tasks:
- [ ] **2.1** Simple card creation form (recipient name, occasion, interests)
- [ ] **2.2** Call Google Gemini to generate card prompt
- [ ] **2.3** Call Google Imagen to generate card image
- [ ] **2.4** Display generated card to user
- [ ] **2.5** Save card design to database (PostgreSQL)

**Deliverable**: User can generate and see an AI card

---

## Phase 3: Gift Card Selection (Week 2-3)
**Goal**: User can select a gift card

### Priority Tasks:
- [ ] **3.1** Display mock gift card catalog (Amazon, Starbucks, Target)
- [ ] **3.2** User selects merchant and enters amount
- [ ] **3.3** Mock gift card issuance (generate fake code/PIN)
- [ ] **3.4** Store gift card data in database

**Deliverable**: User can "purchase" a mock gift card

---

## Phase 4: SMS Delivery (Week 3)
**Goal**: Send gift to recipient via SMS

### Priority Tasks:
- [ ] **4.1** Create gift delivery page (shows card + gift card)
- [ ] **4.2** Generate unique gift URL
- [ ] **4.3** Send SMS to recipient with gift link
- [ ] **4.4** Recipient opens link and sees card reveal
- [ ] **4.5** Recipient can view gift card details

**Deliverable**: Complete end-to-end flow working!

---

## Phase 5: Group Gifting (Week 4)
**Goal**: Multiple people can contribute messages

### Priority Tasks:
- [ ] **5.1** Add viewer phone numbers to gift
- [ ] **5.2** Generate unique invitation links for each viewer
- [ ] **5.3** Viewer can add their message
- [ ] **5.4** Track when recipient opens card
- [ ] **5.5** Send viewer messages after card is opened

**Deliverable**: Group gifting works!

---

## Phase 6: Polish & Production Prep (Week 5)
**Goal**: Make it production-ready

### Priority Tasks:
- [ ] **6.1** Add basic authentication (phone number login)
- [ ] **6.2** Add payment processing (Stripe)
- [ ] **6.3** Replace mock gift cards with real NeoCurrency API
- [ ] **6.4** Add error handling and retry logic
- [ ] **6.5** Deploy to production (Vercel + Railway/Render)

**Deliverable**: Live, working product!

---

## Simplified Tech Stack for MVP

### Frontend:
- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **React Hook Form** - Forms
- **Axios** - API calls

### Backend:
- **Express.js** - API server
- **PostgreSQL** - Database (via Supabase for easy setup)
- **Bull** - Job queue for scheduled messages
- **Redis** - Cache and queue storage

### External Services:
- ✅ **Google AI** - Card generation (configured!)
- ⏳ **Twilio** - SMS (need credentials)
- ⏳ **Mock Gift Cards** - Development (ready to build)
- ⏳ **Stripe** - Payments (can add later)

---

## What We're Skipping for MVP

These can be added after the core flow works:

- ❌ Advanced card editor (use simple AI generation only)
- ❌ Template gallery (AI generation only)
- ❌ Sticker packs (add later)
- ❌ Apple/Google Wallet integration (show code/PIN instead)
- ❌ Neo4j shopping personas (simple recommendations)
- ❌ Neuro-SAN multi-agent (use simple Google AI calls)
- ❌ Complex animations (simple reveal)
- ❌ Scheduling (send immediately)

---

## Success Metrics for MVP

### Must Have:
1. ✅ User can generate a card with AI
2. ✅ User can select a gift card
3. ✅ User can send via SMS
4. ✅ Recipient can view card and gift
5. ✅ Group members can add messages

### Nice to Have:
- Payment processing
- Real gift cards
- Wallet integration
- Advanced editing

---

## Current Status

✅ **Completed:**
- Spec created (requirements, design, tasks)
- Google AI configured and tested
- Figma integration ready
- Git repository initialized

⏳ **Next Steps:**
1. Get Twilio credentials
2. Start Phase 1: Foundation
3. Build end-to-end flow

---

## Time Estimate

- **Phase 1**: 3-5 days
- **Phase 2**: 3-5 days
- **Phase 3**: 2-3 days
- **Phase 4**: 2-3 days
- **Phase 5**: 3-5 days
- **Phase 6**: 5-7 days

**Total MVP**: 3-4 weeks of focused development

---

## Let's Start!

**Immediate Next Steps:**

1. **Get Twilio Account** (5 minutes)
   - Sign up: https://www.twilio.com/try-twilio
   - Get Account SID, Auth Token, Phone Number
   - Add to `.env` file

2. **Start Task 1: Monorepo Setup** (30 minutes)
   - Create packages structure
   - Set up TypeScript configs
   - Install dependencies

3. **Test All APIs** (15 minutes)
   - Test Google AI ✅ (already working!)
   - Test Twilio SMS
   - Test mock gift cards

**Ready to begin?** Let's get your Twilio credentials first!
