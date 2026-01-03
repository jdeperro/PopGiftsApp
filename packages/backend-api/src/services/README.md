# Gift Card Service

## Overview

The Gift Card Service provides a unified interface for gift card operations. It automatically switches between a mock service (for development) and the real NeoCurrency API (for production).

## Features

✅ **12 Popular Merchants** - Amazon, Starbucks, Target, Walmart, Apple, Spotify, Netflix, Uber, DoorDash, Sephora, Nike, Best Buy  
✅ **Full Catalog** - Browse all available gift cards  
✅ **Search** - Find gift cards by name or category  
✅ **Standard Gift Cards** - Issue gift cards with custom amounts  
✅ **Product-Specific Gift Cards** - Create gift cards for specific products (Amazon/Walmart)  
✅ **Recommendations** - Get personalized gift card suggestions  
✅ **Balance Checking** - Check remaining balance  
✅ **Wallet Integration** - Generate Apple/Google Wallet passes  

## Usage

### Get Catalog

```typescript
import { giftCardService } from './services/gift-card-service';

const catalog = await giftCardService.getCatalog();
console.log(catalog.merchants); // Array of 12 merchants
```

### Search Gift Cards

```typescript
// Search by name
const results = await giftCardService.searchGiftCards('coffee');
// Returns: Starbucks

// Search by category
const results = await giftCardService.searchGiftCards(undefined, 'electronics');
// Returns: Amazon, Apple, Best Buy
```

### Issue Standard Gift Card

```typescript
const result = await giftCardService.issueGiftCard(
  'amazon',           // merchant_id
  50.00,              // amount
  'user@example.com', // recipient_email
  {                   // optional metadata
    sender_name: 'John Doe',
    occasion: 'birthday'
  }
);

console.log(result.gift_card);
// {
//   id: 'gc_mock_...',
//   merchant_id: 'amazon',
//   merchant_name: 'Amazon',
//   amount: 50.00,
//   code: 'XXXX-XXXX-XXXX-XXXX',
//   pin: '1234',
//   redemption_url: '...',
//   wallet_pass_url: '...',
//   qr_code_url: '...',
//   expires_at: '2026-...',
//   status: 'active'
// }
```

### Issue Product-Specific Gift Card

```typescript
const result = await giftCardService.issueProductGiftCard(
  'amazon',
  'https://amazon.com/product/B08N5WRWNW',
  'user@example.com',
  {
    sender_name: 'Jane Doe'
  }
);

console.log(result.gift_card);
// Includes product_url, product_name, cart_preload_url, etc.
```

### Get Recommendations

```typescript
const recommendations = await giftCardService.recommendGiftCards(
  ['coffee', 'books', 'music'],  // interests
  'birthday',                     // occasion (optional)
  3                               // limit (default: 3)
);

console.log(recommendations.merchants);
// Returns top 3 matching merchants
```

### Check Balance

```typescript
const balance = await giftCardService.getBalance('gc_mock_123');
console.log(balance);
// { balance: 45.50, currency: 'USD' }
```

### Generate Wallet Pass

```typescript
const pass = await giftCardService.getWalletPass('gc_mock_123', 'apple');
console.log(pass);
// {
//   pass_url: 'https://...',
//   download_url: 'https://...'
// }
```

## API Endpoints

All endpoints are available at `/api/gift-cards`:

### GET /api/gift-cards/catalog
Get full catalog of available merchants

**Response:**
```json
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
      "available": true,
      "description": "Shop millions of products"
    }
  ]
}
```

### GET /api/gift-cards/search?q=amazon&category=retail
Search gift cards

**Query Parameters:**
- `q` - Search query (optional)
- `category` - Filter by category (optional)

### GET /api/gift-cards/merchants/:merchantId
Get merchant details

### POST /api/gift-cards/issue
Issue a standard gift card

**Request Body:**
```json
{
  "merchant_id": "amazon",
  "amount": 50.00,
  "recipient_email": "user@example.com",
  "metadata": {
    "sender_name": "John Doe",
    "occasion": "birthday"
  }
}
```

### POST /api/gift-cards/issue-product
Issue a product-specific gift card

**Request Body:**
```json
{
  "merchant_id": "amazon",
  "product_url": "https://amazon.com/product/...",
  "recipient_email": "user@example.com",
  "metadata": {}
}
```

### GET /api/gift-cards/:giftCardId/balance
Check gift card balance

### GET /api/gift-cards/:giftCardId/wallet-pass?platform=apple
Generate wallet pass

**Query Parameters:**
- `platform` - Either `apple` or `google`

### POST /api/gift-cards/recommend
Get personalized recommendations

**Request Body:**
```json
{
  "interests": ["coffee", "books", "music"],
  "occasion": "birthday",
  "limit": 3
}
```

## Configuration

### Environment Variables

```bash
# Use mock service (true) or real NeoCurrency API (false)
NEOCURRENCY_SANDBOX=true

# NeoCurrency API credentials (for production)
NEOCURRENCY_API_KEY=your_api_key
NEOCURRENCY_API_SECRET=your_api_secret
NEOCURRENCY_MERCHANT_ID=your_merchant_id
NEOCURRENCY_API_URL=https://api.neocurrency.com/v1
```

## Mock vs Real API

### Mock Service (Development)
- ✅ Works immediately, no API keys needed
- ✅ 12 popular merchants
- ✅ Realistic gift card codes and PINs
- ✅ Simulates API delays
- ✅ Perfect for development and testing

### Real NeoCurrency API (Production)
- ✅ 1,500+ merchants
- ✅ Real gift cards with actual value
- ✅ Apple/Google Wallet integration
- ✅ Balance checking
- ✅ Redemption tracking

## Switching to Real API

When you're ready to use the real NeoCurrency API:

1. Get NeoCurrency API credentials
2. Update `.env`:
   ```bash
   NEOCURRENCY_SANDBOX=false
   NEOCURRENCY_API_KEY=your_real_key
   NEOCURRENCY_API_SECRET=your_real_secret
   NEOCURRENCY_MERCHANT_ID=your_merchant_id
   ```
3. Implement real API calls in `gift-card-service.ts`
4. Test thoroughly before going live

## Available Merchants (Mock)

1. **Amazon** - Retail, Electronics, Books ($1-$2,000)
2. **Starbucks** - Coffee, Food ($5-$500)
3. **Target** - Retail, Home, Clothing ($10-$1,000)
4. **Walmart** - Retail, Grocery, Electronics ($5-$1,000)
5. **Apple** - Electronics, Technology ($25-$2,000)
6. **Spotify** - Music, Entertainment ($10-$100)
7. **Netflix** - Streaming, Entertainment ($25-$200)
8. **Uber** - Transportation, Food Delivery ($15-$500)
9. **DoorDash** - Food Delivery ($15-$500)
10. **Sephora** - Beauty, Cosmetics ($10-$500)
11. **Nike** - Sports, Clothing, Shoes ($25-$500)
12. **Best Buy** - Electronics, Technology ($15-$2,000)

## Testing

Run the test script:

```bash
node test-gift-cards.js
```

This will test:
- ✅ Catalog retrieval
- ✅ Search functionality
- ✅ Gift card issuance
- ✅ Recommendations

## Next Steps

1. ✅ Mock service is ready to use
2. ⏳ Integrate with backend API
3. ⏳ Build frontend UI
4. ⏳ Apply for NeoCurrency partnership
5. ⏳ Switch to real API when approved

## Support

For questions or issues:
- Check `config/neocurrency-gift-cards-setup.md`
- Review the mock service code
- Test with `test-gift-cards.js`
