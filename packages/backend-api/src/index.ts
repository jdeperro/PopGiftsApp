/**
 * Pop Gifts Backend API
 * Main entry point
 */

// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';

// Try multiple .env locations for Railway compatibility
dotenv.config(); // Current directory
dotenv.config({ path: path.join(__dirname, '../.env') }); // Parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') }); // Root directory

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import giftCardRoutes from './routes/gift-cards';
import cardRoutes from './routes/cards';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'pop-gifts-api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Comprehensive diagnostic endpoint
app.get('/debug/env', async (req: Request, res: Response) => {
  console.log('\n🔍 Environment Diagnostic Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    deployment_info: {
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,
      commit_hash: process.env.RAILWAY_GIT_COMMIT_SHA || 'unknown'
    },
    environment_variables: {
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY ? {
        exists: true,
        length: process.env.GOOGLE_AI_API_KEY.length,
        starts_with: process.env.GOOGLE_AI_API_KEY.substring(0, 8) + '...',
        ends_with: '...' + process.env.GOOGLE_AI_API_KEY.substring(process.env.GOOGLE_AI_API_KEY.length - 4),
        format_valid: process.env.GOOGLE_AI_API_KEY.startsWith('AIza'),
        is_literal_reference: process.env.GOOGLE_AI_API_KEY.includes('{{') || process.env.GOOGLE_AI_API_KEY.includes('shared')
      } : { 
        exists: false,
        raw_value: process.env.GOOGLE_AI_API_KEY || 'undefined'
      },
      GOOGLE_TEXT_MODEL: {
        value: process.env.GOOGLE_TEXT_MODEL || 'NOT SET',
        is_default: !process.env.GOOGLE_TEXT_MODEL
      },
      GOOGLE_IMAGE_MODEL: {
        value: process.env.GOOGLE_IMAGE_MODEL || 'NOT SET', 
        is_default: !process.env.GOOGLE_IMAGE_MODEL
      }
    },
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('GOOGLE') || key.includes('API') || key.includes('MODEL')
    ),
    google_ai_service: {
      initialized: false,
      connection_test: null as boolean | null,
      error: null as any
    }
  };

  // Test Google AI Service
  try {
    const { googleAIService } = await import('./services/google-ai-service');
    
    console.log('🧪 Testing Google AI connection...');
    const connectionResult = await googleAIService.testConnection();
    
    diagnostics.google_ai_service = {
      initialized: true,
      connection_test: connectionResult,
      error: null
    };
    
    console.log(`✅ Connection test result: ${connectionResult}`);
    
  } catch (error: any) {
    console.error('❌ Google AI Service error:', error);
    diagnostics.google_ai_service = {
      initialized: false,
      connection_test: false,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3)
      }
    };
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  res.json(diagnostics);
});

// API Routes
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/cards', cardRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /health',
      'GET /debug/env',
      'GET /api/cards/test',
      'POST /api/cards/generate',
      'POST /api/cards/generate-message',
      'GET /api/gift-cards/catalog',
      'GET /api/gift-cards/search',
      'POST /api/gift-cards/issue',
      'POST /api/gift-cards/recommend'
    ]
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🎁 Pop Gifts API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎁 Gift Cards API: http://localhost:${PORT}/api/gift-cards/catalog`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Debug environment variables
  console.log('🔍 Environment Variables Debug:');
  console.log(`   GOOGLE_AI_API_KEY: ${process.env.GOOGLE_AI_API_KEY ? 'SET (length: ' + process.env.GOOGLE_AI_API_KEY.length + ')' : 'NOT SET'}`);
  console.log(`   GOOGLE_TEXT_MODEL: ${process.env.GOOGLE_TEXT_MODEL || 'NOT SET'}`);
  console.log(`   GOOGLE_IMAGE_MODEL: ${process.env.GOOGLE_IMAGE_MODEL || 'NOT SET'}`);
  console.log(`   TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? 'SET' : 'NOT SET'}`);
  
  console.log(`✅ Google AI: ${process.env.GOOGLE_AI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`✅ Twilio SMS: ${process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured'}`);
  console.log(`✅ Gift Cards: Mock service ready`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

export default app;
