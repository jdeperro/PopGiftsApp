# Railway Build Fix Summary

## Problem
Railway deployment failing with error: `npm ci` exit code 1
- Railway was trying to run `npm ci` in root directory
- But `package.json` is in `packages/backend-api/`

## Solution
1. **Updated `railway.json`** - Added explicit build command to cd into correct directory
2. **Added root `package.json`** - Provides monorepo structure for Railway
3. **Fixed AI model references** - Updated agents to use environment variables instead of hardcoded models

## Files Changed
- `railway.json` - Railway build configuration
- `package.json` - Root package.json for monorepo
- `packages/backend-api/src/agents/orchestration-agent.ts` - Fixed hardcoded model names
- `packages/backend-api/src/agents/illustrator-agent.ts` - Fixed hardcoded model names

## Environment Variables Required
Set these in Railway "Shared Variables":
```
GOOGLE_AI_API_KEY=your-api-key
GOOGLE_TEXT_MODEL=models/gemini-2.5-flash
GOOGLE_IMAGE_MODEL=models/gemini-3-pro-image-preview
```

## Expected Result
- Railway build should succeed
- AI artwork generation should work with real images instead of colored shapes
- Users will see proper gaming-themed birthday cards with AI-generated artwork