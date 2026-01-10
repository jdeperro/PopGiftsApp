# NeoCurrency Gift Card API Setup Guide

## Overview

NeoCurrency provides the gift card infrastructure for Pop Gifts, including:
- 1,500+ merchant gift card catalog
- Digital gift card issuance
- Apple Wallet & Google Wallet pass generation
- Real-time balance checking
- Secure redemption

## Getting Started with NeoCurrency

### Step 1: Sign Up for NeoCurrency

1. **Visit NeoCurrency**
   - Website: https://www.neocurrency.com/
   - Or: https://developer.neocurrency.com/

2. **Request API Access**
   - Click "Get Started" or "Contact Sales"
   - Fill out the partnership form
   - Mention you're building a digital gifting platform
   - They'll schedule a demo/onboarding call

3. **Complete Onboarding**
   - Sign partnership agreement
   - Complete compliance requirements (KYC/AML)
   - Set up billing account
   - Receive API credentials

### Step 2: Get Your API Credentials

After onboarding, you'll receive:
- **API Key**: Your authentication key
- **API Secret**: For signing requests
- **Merchant ID**: Your unique merchant identifier
- **Sandbox Credentials**: For testing

### Step 3: Add to .env File

```bash
# NeoCurrency Configuration
NEOCURRENCY_API_KEY=your_api_key_here
NEOCURRENCY_API_SECRET=your_api_secret_here
NEOCURRENCY_MERCHANT_ID=your_merchant_id_here
NEOCURRENCY_API_URL=https://api.neocurrency.com/v1
NEOCURRENCY_SANDBOX=true  # Set to false for production
```

## Alternative: Mock Gift Card Service (for MVP)

If you want to start building before NeoCurrency approval, you can use a mock service:

### Option 1: Use Rybbon API (Alternative)
- Website: https://www.rybbon.com/
- Similar gift card API
- Faster onboarding
- Good for testing

### Option 2: Build Mock Service
I can help you create a mock gift card service for development that mimics the NeoCurrency API.

## NeoCurrency API Overview

### Key Endpoints

```typescript
// Base URL
const BASE_URL = 'https://api.neocurrency.com/v1';

// Authentication
headers: {
  'Authorization': `Bearer ${NEOCURRENCY_API_KEY}`,
  'Content-Type': 'application/json'
}
```

### 1. Get Gift Card Catalog

```typescript
// GET /catalog
async function getCatalog() {
  const response = await fetch(`${BASE_URL}/catalog`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`
    }
  });
  
  const data = await response.json();
  return data.merchants; // Array of 1,500+ merchants
}

// Response format:
{
  "merchants": [
    {
      "id": "amazon",
      "name": "Amazon",
      "logo_url": "https://...",
      "categories": ["retail", "electronics"],
      "min_value": 1.00,
      "max_value": 2000.00,
      "currency": "USD",
      "available": true
    }
  ]
}
```

### 2. Search Gift Cards

```typescript
// GET /catalog/search?q=amazon&category=retail
async function searchGiftCards(query: string, category?: string) {
  const params = new URLSearchParams({ q: query });
  if (category) params.append('category', category);
  
  const response = await fetch(`${BASE_URL}/catalog/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`
    }
  });
  
  return await response.json();
}
```

### 3. Issue Gift Card

```typescript
// POST /gift-cards
async function issueGiftCard(merchantId: string, amount: number, recipientEmail: string) {
  const response = await fetch(`${BASE_URL}/gift-cards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amount,
      currency: 'USD',
      recipient: {
        email: recipientEmail
      },
      metadata: {
        order_id: 'gift_123',
        sender_name: 'John Doe'
      }
    })
  });
  
  const data = await response.json();
  return data;
}

// Response format:
{
  "gift_card": {
    "id": "gc_abc123",
    "merchant_id": "amazon",
    "amount": 50.00,
    "currency": "USD",
    "code": "XXXX-XXXX-XXXX",
    "pin": "1234",
    "redemption_url": "https://...",
    "wallet_pass_url": "https://...",
    "expires_at": "2026-12-31T23:59:59Z",
    "status": "active"
  }
}
```

### 4. Generate Wallet Pass

```typescript
// GET /gift-cards/{id}/wallet-pass?platform=apple
async function getWalletPass(giftCardId: string, platform: 'apple' | 'google') {
  const response = await fetch(
    `${BASE_URL}/gift-cards/${giftCardId}/wallet-pass?platform=${platform}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`
      }
    }
  );
  
  // Returns .pkpass file for Apple or JWT for Google
  return await response.blob();
}
```

### 5. Check Balance

```typescript
// GET /gift-cards/{id}/balance
async function checkBalance(giftCardId: string) {
  const response = await fetch(`${BASE_URL}/gift-cards/${giftCardId}/balance`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`
    }
  });
  
  const data = await response.json();
  return data.balance;
}
```

### 6. Product-Specific Gift Cards (for your feature)

```typescript
// POST /gift-cards/product-specific
async function createProductGiftCard(
  merchantId: string,
  productUrl: string,
  recipientEmail: string
) {
  const response = await fetch(`${BASE_URL}/gift-cards/product-specific`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchant_id: merchantId,
      product_url: productUrl,
      recipient: {
        email: recipientEmail
      },
      options: {
        allow_cash_conversion: true, // User can choose cash instead
        pre_load_cart: true
      }
    })
  });
  
  return await response.json();
}
```

## Pricing

### NeoCurrency Typical Pricing:
- **Setup Fee**: $0 - $5,000 (negotiable)
- **Monthly Fee**: $0 - $500 (based on volume)
- **Per Transaction**: 2-5% of gift card value
- **Minimum**: Often $1,000/month in volume

### Example Costs:
- **$50 gift card**: $1.00 - $2.50 fee
- **1,000 cards/month** ($50 avg): $1,000 - $2,500 in fees

## Mock Service for Development

Let me create a mock NeoCurrency service you can use while waiting for approval:

```typescript
// mock-neocurrency-service.ts
export class MockNeoCurrencyService {
  private mockCatalog = [
    {
      id: 'amazon',
      name: 'Amazon',
      logo_url: 'https://logo.clearbit.com/amazon.com',
      categories: ['retail', 'electronics'],
      min_value: 1.00,
      max_value: 2000.00,
      currency: 'USD',
      available: true
    },
    {
      id: 'starbucks',
      name: 'Starbucks',
      logo_url: 'https://logo.clearbit.com/starbucks.com',
      categories: ['food', 'coffee'],
      min_value: 5.00,
      max_value: 500.00,
      currency: 'USD',
      available: true
    },
    {
      id: 'target',
      name: 'Target',
      logo_url: 'https://logo.clearbit.com/target.com',
      categories: ['retail'],
      min_value: 10.00,
      max_value: 1000.00,
      currency: 'USD',
      available: true
    }
    // Add more merchants as needed
  ];
  
  async getCatalog() {
    return { merchants: this.mockCatalog };
  }
  
  async searchGiftCards(query: string) {
    const results = this.mockCatalog.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
    return { merchants: results };
  }
  
  async issueGiftCard(merchantId: string, amount: number, recipientEmail: string) {
    const merchant = this.mockCatalog.find(m => m.id === merchantId);
    
    return {
      gift_card: {
        id: `gc_mock_${Date.now()}`,
        merchant_id: merchantId,
        merchant_name: merchant?.name,
        amount: amount,
        currency: 'USD',
        code: this.generateMockCode(),
        pin: this.generateMockPin(),
        redemption_url: `https://mock-redemption.com/${merchantId}`,
        wallet_pass_url: `https://mock-wallet.com/pass/${merchantId}`,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    };
  }
  
  async getWalletPass(giftCardId: string, platform: 'apple' | 'google') {
    // Return mock wallet pass URL
    return {
      pass_url: `https://mock-wallet.com/${platform}/${giftCardId}`,
      download_url: `https://mock-wallet.com/download/${giftCardId}`
    };
  }
  
  private generateMockCode(): string {
    return Array(4).fill(0).map(() => 
      Math.random().toString(36).substring(2, 6).toUpperCase()
    ).join('-');
  }
  
  private generateMockPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
```

## Integration Example

```typescript
// services/gift-card-service.ts
import { MockNeoCurrencyService } from './mock-neocurrency-service';

class GiftCardService {
  private client: any;
  
  constructor() {
    if (process.env.NEOCURRENCY_SANDBOX === 'true') {
      this.client = new MockNeoCurrencyService();
    } else {
      // Real NeoCurrency client
      this.client = new NeoCurrencyClient({
        apiKey: process.env.NEOCURRENCY_API_KEY,
        apiSecret: process.env.NEOCURRENCY_API_SECRET
      });
    }
  }
  
  async getCatalog() {
    return await this.client.getCatalog();
  }
  
  async issueGiftCard(merchantId: string, amount: number, recipientEmail: string) {
    return await this.client.issueGiftCard(merchantId, amount, recipientEmail);
  }
  
  async getWalletPass(giftCardId: string, platform: 'apple' | 'google') {
    return await this.client.getWalletPass(giftCardId, platform);
  }
}

export default new GiftCardService();
```

## Testing

```typescript
// test-gift-cards.ts
import giftCardService from './services/gift-card-service';

async function test() {
  // Get catalog
  const catalog = await giftCardService.getCatalog();
  console.log('✅ Catalog loaded:', catalog.merchants.length, 'merchants');
  
  // Issue a test gift card
  const giftCard = await giftCardService.issueGiftCard(
    'amazon',
    50.00,
    'test@example.com'
  );
  console.log('✅ Gift card issued:', giftCard.gift_card.id);
  
  // Get wallet pass
  const pass = await giftCardService.getWalletPass(
    giftCard.gift_card.id,
    'apple'
  );
  console.log('✅ Wallet pass generated:', pass.pass_url);
}

test();
```

## Next Steps

### For MVP (Start Now):
1. ✅ Use mock service for development
2. ✅ Build full gift card flow
3. ✅ Test end-to-end experience
4. ⏳ Apply for NeoCurrency partnership

### For Production:
1. Complete NeoCurrency onboarding
2. Get production API credentials
3. Switch from mock to real service
4. Test with real gift cards
5. Launch!

## Alternative Services

If NeoCurrency doesn't work out:

1. **Rybbon** - https://www.rybbon.com/
2. **Tremendous** - https://www.tremendous.com/
3. **Giftbit** - https://www.giftbit.com/
4. **Tango Card** - https://www.tangocard.com/

All offer similar APIs and faster onboarding.

## Support

- **NeoCurrency**: contact@neocurrency.com
- **Documentation**: https://developer.neocurrency.com/docs
- **Status**: Check their website for API status

---

**Ready to start?** Use the mock service now and apply for NeoCurrency partnership in parallel!
