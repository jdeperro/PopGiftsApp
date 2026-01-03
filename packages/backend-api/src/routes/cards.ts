/**
 * Card Generation API Routes
 */

import { Router, Request, Response } from 'express';
import { googleAIService, MadlibInput } from '../services/google-ai-service';

const router = Router();

/**
 * POST /api/cards/generate
 * Generate 3 card designs from madlib input
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input: MadlibInput = req.body;

    // Validation
    if (!input.recipient_name || !input.occasion || !input.interests) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['recipient_name', 'occasion', 'interests']
      });
    }

    if (!Array.isArray(input.interests) || input.interests.length === 0) {
      return res.status(400).json({
        error: 'Invalid interests',
        message: 'Interests must be a non-empty array'
      });
    }

    // Generate card designs
    const designs = await googleAIService.generateCardDesigns(input);

    // Generate message if not provided
    let message = input.message;
    if (!message) {
      message = await googleAIService.generateMessage(input);
    }

    res.json({
      designs,
      message,
      input
    });
  } catch (error) {
    console.error('Error generating cards:', error);
    res.status(500).json({
      error: 'Failed to generate cards',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/cards/refine
 * Refine a card design based on user feedback
 */
router.post('/refine', async (req: Request, res: Response) => {
  try {
    const { original_prompt, refinement_request } = req.body;

    if (!original_prompt || !refinement_request) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['original_prompt', 'refinement_request']
      });
    }

    const refinedDesign = await googleAIService.refineCardDesign(
      original_prompt,
      refinement_request
    );

    res.json({
      design: refinedDesign
    });
  } catch (error) {
    console.error('Error refining card:', error);
    res.status(500).json({
      error: 'Failed to refine card',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/cards/generate-message
 * Generate a heartfelt message
 */
router.post('/generate-message', async (req: Request, res: Response) => {
  try {
    const input: MadlibInput = req.body;

    if (!input.recipient_name || !input.occasion) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['recipient_name', 'occasion']
      });
    }

    const message = await googleAIService.generateMessage(input);

    res.json({
      message
    });
  } catch (error) {
    console.error('Error generating message:', error);
    res.status(500).json({
      error: 'Failed to generate message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/cards/check-grammar
 * Check grammar and spelling
 */
router.post('/check-grammar', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Missing required field',
        required: ['text']
      });
    }

    const correctedText = await googleAIService.checkGrammar(text);

    res.json({
      original: text,
      corrected: correctedText,
      has_changes: text !== correctedText
    });
  } catch (error) {
    console.error('Error checking grammar:', error);
    res.status(500).json({
      error: 'Failed to check grammar',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/cards/test
 * Test Google AI connection
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    const isConnected = await googleAIService.testConnection();

    res.json({
      status: isConnected ? 'connected' : 'disconnected',
      service: 'Google AI',
      models: {
        text: process.env.GOOGLE_TEXT_MODEL || 'gemini-2.5-flash',
        image: process.env.GOOGLE_IMAGE_MODEL || 'imagen-3'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Connection test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
