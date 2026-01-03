/**
 * Gift Card API Routes
 */

import { Router, Request, Response } from 'express';
import { giftCardService } from '../services/gift-card-service';

const router = Router();

/**
 * GET /api/gift-cards/catalog
 * Get full gift card catalog
 */
router.get('/catalog', async (req: Request, res: Response) => {
  try {
    const catalog = await giftCardService.getCatalog();
    res.json(catalog);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({
      error: 'Failed to fetch gift card catalog',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gift-cards/search
 * Search gift cards by query and/or category
 * Query params: q (query), category
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;
    
    const results = await giftCardService.searchGiftCards(
      q as string | undefined,
      category as string | undefined
    );
    
    res.json(results);
  } catch (error) {
    console.error('Error searching gift cards:', error);
    res.status(500).json({
      error: 'Failed to search gift cards',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gift-cards/merchants/:merchantId
 * Get merchant details by ID
 */
router.get('/merchants/:merchantId', async (req: Request, res: Response) => {
  try {
    const { merchantId } = req.params;
    
    const merchant = await giftCardService.getMerchant(merchantId);
    
    if (!merchant) {
      return res.status(404).json({
        error: 'Merchant not found',
        merchant_id: merchantId
      });
    }
    
    res.json({ merchant });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({
      error: 'Failed to fetch merchant',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/gift-cards/issue
 * Issue a standard gift card
 * Body: { merchant_id, amount, recipient_email, metadata? }
 */
router.post('/issue', async (req: Request, res: Response) => {
  try {
    const { merchant_id, amount, recipient_email, metadata } = req.body;
    
    // Validation
    if (!merchant_id || !amount || !recipient_email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['merchant_id', 'amount', 'recipient_email']
      });
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }
    
    const result = await giftCardService.issueGiftCard(
      merchant_id,
      amount,
      recipient_email,
      metadata
    );
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error issuing gift card:', error);
    res.status(500).json({
      error: 'Failed to issue gift card',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/gift-cards/issue-product
 * Issue a product-specific gift card
 * Body: { merchant_id, product_url, recipient_email, metadata? }
 */
router.post('/issue-product', async (req: Request, res: Response) => {
  try {
    const { merchant_id, product_url, recipient_email, metadata } = req.body;
    
    // Validation
    if (!merchant_id || !product_url || !recipient_email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['merchant_id', 'product_url', 'recipient_email']
      });
    }
    
    const result = await giftCardService.issueProductGiftCard(
      merchant_id,
      product_url,
      recipient_email,
      metadata
    );
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error issuing product gift card:', error);
    res.status(500).json({
      error: 'Failed to issue product gift card',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gift-cards/:giftCardId/balance
 * Get gift card balance
 */
router.get('/:giftCardId/balance', async (req: Request, res: Response) => {
  try {
    const { giftCardId } = req.params;
    
    const balance = await giftCardService.getBalance(giftCardId);
    
    res.json(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      error: 'Failed to fetch gift card balance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gift-cards/:giftCardId/wallet-pass
 * Generate wallet pass (Apple/Google)
 * Query params: platform (apple|google)
 */
router.get('/:giftCardId/wallet-pass', async (req: Request, res: Response) => {
  try {
    const { giftCardId } = req.params;
    const { platform } = req.query;
    
    if (!platform || (platform !== 'apple' && platform !== 'google')) {
      return res.status(400).json({
        error: 'Invalid platform',
        message: 'Platform must be either "apple" or "google"'
      });
    }
    
    const pass = await giftCardService.getWalletPass(
      giftCardId,
      platform as 'apple' | 'google'
    );
    
    res.json(pass);
  } catch (error) {
    console.error('Error generating wallet pass:', error);
    res.status(500).json({
      error: 'Failed to generate wallet pass',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/gift-cards/recommend
 * Get gift card recommendations based on interests
 * Body: { interests: string[], occasion?: string, limit?: number }
 */
router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const { interests, occasion, limit } = req.body;
    
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        error: 'Invalid interests',
        message: 'Interests must be a non-empty array of strings'
      });
    }
    
    const recommendations = await giftCardService.recommendGiftCards(
      interests,
      occasion,
      limit
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      error: 'Failed to get gift card recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
