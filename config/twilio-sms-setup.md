# Twilio SMS Setup Guide

## Overview

Twilio will handle all SMS messaging for:
- Sending gift card links to recipients
- Group message orchestration
- Viewer message delivery after card is opened
- Authentication verification codes (phone number login)

## Getting Started with Twilio

### Step 1: Create Twilio Account

1. **Sign up for Twilio**
   - Visit: https://www.twilio.com/try-twilio
   - Click "Sign up and start building"
   - Fill in your details
   - Verify your email

2. **Verify Your Phone Number**
   - Twilio will ask you to verify your phone number
   - You'll receive a verification code via SMS
   - Enter the code to verify

### Step 2: Get Your Credentials

1. **Go to Twilio Console**
   - Visit: https://console.twilio.com/
   - You'll see your dashboard

2. **Find Your Account Credentials**
   - On the dashboard, you'll see:
     - **Account SID**: Starts with "AC..."
     - **Auth Token**: Click "Show" to reveal it
   - Copy both of these

3. **Get a Phone Number**
   - Click "Get a trial number" (or "Buy a number" for production)
   - Twilio will assign you a phone number
   - Copy this number (format: +1234567890)

### Step 3: Add to .env File

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=AC...your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Trial Account Limitations

### Free Trial Includes:
- ✅ $15.50 in free credit
- ✅ One free phone number
- ✅ Can send SMS to verified numbers only
- ✅ Perfect for development and testing

### Trial Restrictions:
- ⚠️ Can only send to verified phone numbers
- ⚠️ Messages include "Sent from your Twilio trial account"
- ⚠️ Limited to verified numbers (add them in console)

### To Verify Additional Numbers (for testing):
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "Add a new number"
3. Enter the phone number
4. Verify via SMS code

## Upgrading to Production

### When to Upgrade:
- When you're ready to send to any phone number
- When you want to remove the trial message
- When you need more than one phone number

### How to Upgrade:
1. Go to: https://console.twilio.com/us1/billing/manage-billing/upgrade-account
2. Add payment method (credit card)
3. Your account is immediately upgraded
4. No monthly fees - pay only for usage

## Pricing (Pay-as-you-go)

### SMS Costs (US):
- **Outbound SMS**: $0.0079 per message
- **Inbound SMS**: $0.0079 per message
- **Phone Number**: $1.15/month

### Example Costs for Pop Gifts:
- **Per gift sent** (1 recipient + 3 viewers):
  - Initial gift link: $0.0079
  - 3 viewer messages: $0.0237
  - **Total**: ~$0.03 per gift
  
- **Monthly (1,000 gifts)**:
  - SMS: ~$30
  - Phone number: $1.15
  - **Total**: ~$31/month

## Installation

### Node.js/TypeScript

```bash
npm install twilio
```

### Python (for Neuro-SAN service)

```bash
pip install twilio
```

## Usage Examples

### Send SMS (Node.js)

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendGiftLink(recipientPhone: string, giftUrl: string) {
  const message = await client.messages.create({
    body: `🎁 You've received a gift! Open it here: ${giftUrl}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: recipientPhone
  });
  
  console.log('Message sent:', message.sid);
  return message;
}
```

### Send SMS (Python)

```python
from twilio.rest import Client
import os

client = Client(
    os.getenv('TWILIO_ACCOUNT_SID'),
    os.getenv('TWILIO_AUTH_TOKEN')
)

def send_gift_link(recipient_phone: str, gift_url: str):
    message = client.messages.create(
        body=f'🎁 You\'ve received a gift! Open it here: {gift_url}',
        from_=os.getenv('TWILIO_PHONE_NUMBER'),
        to=recipient_phone
    )
    
    print(f'Message sent: {message.sid}')
    return message
```

### Group Message Orchestration

```typescript
async function sendGroupGift(
  recipientPhone: string,
  viewerPhones: string[],
  giftUrl: string
) {
  // Send to recipient
  await client.messages.create({
    body: `🎁 You've received a group gift! ${giftUrl}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: recipientPhone
  });
  
  // Send to all viewers (creates group thread)
  for (const viewerPhone of viewerPhones) {
    await client.messages.create({
      body: `🎉 Your group gift has been sent to the recipient!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: viewerPhone
    });
  }
}
```

### Phone Number Verification (for Auth)

```typescript
async function sendVerificationCode(phoneNumber: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  await client.messages.create({
    body: `Your Pop Gifts verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
  
  return code; // Store this in Redis with expiration
}
```

## Testing Your Setup

### Quick Test Script

```javascript
// test-twilio.js
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function test() {
  try {
    const message = await client.messages.create({
      body: '🧪 Test message from Pop Gifts!',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+1YOUR_VERIFIED_NUMBER' // Replace with your verified number
    });
    
    console.log('✅ Twilio is working!');
    console.log('Message SID:', message.sid);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

## Best Practices

### 1. Rate Limiting
```typescript
// Implement rate limiting to avoid spam
const rateLimiter = new Map();

function canSendMessage(phoneNumber: string): boolean {
  const lastSent = rateLimiter.get(phoneNumber);
  const now = Date.now();
  
  if (lastSent && now - lastSent < 60000) { // 1 minute
    return false;
  }
  
  rateLimiter.set(phoneNumber, now);
  return true;
}
```

### 2. Error Handling
```typescript
async function sendSMSWithRetry(to: string, body: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. Message Status Tracking
```typescript
// Check message delivery status
async function checkMessageStatus(messageSid: string) {
  const message = await client.messages(messageSid).fetch();
  return message.status; // queued, sent, delivered, failed
}
```

### 4. Webhook for Delivery Receipts
```typescript
// Express endpoint to receive delivery status
app.post('/webhooks/twilio/status', (req, res) => {
  const { MessageSid, MessageStatus, To } = req.body;
  
  console.log(`Message ${MessageSid} to ${To}: ${MessageStatus}`);
  
  // Update database with delivery status
  // Trigger viewer messages if recipient opened (delivered)
  
  res.sendStatus(200);
});
```

## Phone Number Formatting

### Always use E.164 format:
```typescript
function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if missing (assume US)
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  return `+${digits}`;
}
```

## Troubleshooting

### Error: "The number is unverified"
- **Solution**: Add the number to verified numbers in Twilio console
- Or upgrade your account to send to any number

### Error: "Invalid phone number"
- **Solution**: Ensure phone number is in E.164 format (+1234567890)

### Error: "Insufficient funds"
- **Solution**: Add credits to your Twilio account

### Messages not delivering
- Check message status via Twilio console
- Verify phone number is correct and active
- Check for carrier blocks (some carriers block automated messages)

## Security Considerations

### 1. Protect Your Credentials
```typescript
// Never expose credentials in client-side code
// Always use environment variables
// Rotate Auth Token regularly
```

### 2. Validate Phone Numbers
```typescript
import { parsePhoneNumber } from 'libphonenumber-js';

function isValidPhoneNumber(phone: string): boolean {
  try {
    const phoneNumber = parsePhoneNumber(phone, 'US');
    return phoneNumber.isValid();
  } catch {
    return false;
  }
}
```

### 3. Implement Webhook Validation
```typescript
import twilio from 'twilio';

function validateTwilioWebhook(req: Request): boolean {
  const signature = req.headers['x-twilio-signature'];
  const url = `https://yourdomain.com${req.path}`;
  
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body
  );
}
```

## Next Steps

1. ✅ Sign up for Twilio account
2. ✅ Get Account SID, Auth Token, and Phone Number
3. ✅ Add credentials to `.env` file
4. ✅ Verify your test phone numbers
5. ✅ Test sending a message
6. ✅ Implement in your application

## Support

- **Documentation**: https://www.twilio.com/docs/sms
- **Console**: https://console.twilio.com/
- **Support**: https://support.twilio.com/
- **Status**: https://status.twilio.com/

---

**Ready to set up?** Sign up at https://www.twilio.com/try-twilio and get your credentials!
