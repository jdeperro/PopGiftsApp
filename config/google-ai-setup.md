# Google AI Setup Guide

## Why Google AI?

✅ **Better Security** - Enterprise-grade security and compliance  
✅ **Better Privacy** - Data residency and privacy controls  
✅ **Better Performance** - Gemini 1.5 Pro with 2M token context  
✅ **Better Cost** - More competitive pricing than OpenAI  
✅ **Better Integration** - Native Google Cloud integration  

## Getting Your Google AI API Key

### Option 1: Google AI Studio (Quickest - Recommended for Development)

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/

2. **Sign in with your Google account**

3. **Get API Key**
   - Click "Get API Key" in the top right
   - Click "Create API Key"
   - Choose "Create API key in new project" or select existing project
   - Copy the API key

4. **Add to .env file**
   ```bash
   GOOGLE_AI_API_KEY=your_api_key_here
   ```

### Option 2: Google Cloud Console (Recommended for Production)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it "PopGifts Platform" or similar
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - **Generative Language API** (for Gemini text models)
     - **Vertex AI API** (for Imagen image generation)

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - Click "Restrict Key" (recommended)
   - Under "API restrictions", select:
     - Generative Language API
     - Vertex AI API
   - Click "Save"

5. **Get Project ID**
   - Go to "Dashboard"
   - Copy your Project ID (not the project name)

6. **Add to .env file**
   ```bash
   GOOGLE_AI_API_KEY=your_api_key_here
   GOOGLE_AI_PROJECT_ID=your_project_id_here
   ```

## Available Models

### Image Generation (Imagen)

**Imagen 3** (Recommended)
- Best quality, most realistic
- Size: 1024x1024, 1536x1536
- Cost: ~$0.04 per image
- Use: `imagen-3`

**Imagen 2**
- Good quality, faster
- Size: 1024x1024
- Cost: ~$0.02 per image
- Use: `imagen-2`

### Text Generation (Gemini)

**Gemini 1.5 Pro** (Recommended)
- 2M token context window
- Best reasoning and coding
- Cost: $3.50 per 1M input tokens, $10.50 per 1M output tokens
- Use: `gemini-1.5-pro`

**Gemini 1.5 Flash**
- Fast and efficient
- 1M token context window
- Cost: $0.35 per 1M input tokens, $1.05 per 1M output tokens
- Use: `gemini-1.5-flash`

**Gemini 1.0 Pro**
- Stable, reliable
- 32K token context
- Cost: $0.50 per 1M input tokens, $1.50 per 1M output tokens
- Use: `gemini-1.0-pro`

## Cost Comparison (per card generation)

### Google AI (Recommended)
- **Image**: Imagen 3 × 3 = $0.12
- **Text**: Gemini 1.5 Pro = $0.01
- **Total**: ~$0.13 per card
- **Monthly (1,000 cards)**: ~$130

### OpenAI (Not Recommended - Security Concerns)
- **Image**: DALL-E 3 × 3 = $0.12
- **Text**: GPT-4 Turbo = $0.02
- **Total**: ~$0.14 per card
- **Monthly (1,000 cards)**: ~$140

**Google is cheaper AND more secure!**

## Security Benefits

### Google AI Advantages:
1. **Data Residency** - Choose where data is processed
2. **VPC Service Controls** - Network-level security
3. **Customer-Managed Encryption Keys** - Full control over encryption
4. **Audit Logging** - Complete audit trail
5. **Compliance** - SOC 2, ISO 27001, HIPAA, GDPR
6. **No Training on Your Data** - Explicit guarantee

### OpenAI Concerns:
1. Data may be used for training (unless opted out)
2. Limited data residency options
3. Less granular access controls
4. Third-party dependency risk

## Rate Limits

### Google AI Studio (Free Tier)
- **Gemini**: 60 requests per minute
- **Imagen**: 60 requests per minute
- **Daily**: 1,500 requests per day

### Google Cloud (Paid)
- **Gemini**: 1,000 requests per minute
- **Imagen**: 600 requests per minute
- **No daily limits**

## Installation

### Node.js/TypeScript

```bash
npm install @google/generative-ai @google-cloud/aiplatform
```

### Python (for Neuro-SAN service)

```bash
pip install google-generativeai google-cloud-aiplatform
```

## Usage Examples

### Image Generation (Imagen)

```typescript
import { ImageGenerationClient } from '@google-cloud/aiplatform';

const client = new ImageGenerationClient({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  projectId: process.env.GOOGLE_AI_PROJECT_ID
});

const response = await client.generateImages({
  model: 'imagen-3',
  prompt: 'A beautiful birthday card with balloons and confetti',
  numberOfImages: 3,
  aspectRatio: '1:1'
});

const imageUrls = response.images.map(img => img.uri);
```

### Text Generation (Gemini)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const result = await model.generateContent([
  'Write a heartfelt birthday message for Sarah who loves hiking and photography.'
]);

const message = result.response.text();
```

### Python (for Neuro-SAN)

```python
import google.generativeai as genai
from google.cloud import aiplatform

# Configure Gemini
genai.configure(api_key=os.getenv('GOOGLE_AI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-pro')

# Generate text
response = model.generate_content('Write a birthday message')
print(response.text)

# Configure Imagen
aiplatform.init(
    project=os.getenv('GOOGLE_AI_PROJECT_ID'),
    location='us-central1'
)

# Generate images
from google.cloud.aiplatform.gapic.schema import predict

image_generation_model = aiplatform.ImageGenerationModel.from_pretrained("imagen-3")
images = image_generation_model.generate_images(
    prompt="A birthday card with balloons",
    number_of_images=3
)
```

## Testing Your Setup

### Quick Test Script

```bash
# Create test script
cat > test-google-ai.js << 'EOF'
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const result = await model.generateContent(['Say hello!']);
  console.log('✅ Google AI is working!');
  console.log('Response:', result.response.text());
}

test().catch(console.error);
EOF

# Run test
node test-google-ai.js
```

## Troubleshooting

### Error: "API key not valid"
- Check that you copied the full API key
- Verify the API key hasn't been restricted to specific IPs
- Make sure you enabled the required APIs

### Error: "Quota exceeded"
- You've hit the free tier limit (1,500 requests/day)
- Upgrade to paid tier in Google Cloud Console
- Or wait 24 hours for quota reset

### Error: "Permission denied"
- Enable Generative Language API in Cloud Console
- Enable Vertex AI API in Cloud Console
- Check that your API key has the right permissions

## Next Steps

1. ✅ Get your Google AI API key
2. ✅ Add it to `.env` file
3. ✅ Test the connection
4. ✅ Start building!

## Support

- **Documentation**: https://ai.google.dev/docs
- **Vertex AI**: https://cloud.google.com/vertex-ai/docs
- **Community**: https://discuss.ai.google.dev/
- **Status**: https://status.cloud.google.com/

---

**Ready to get your API key?** Follow Option 1 (Google AI Studio) for the quickest setup!
