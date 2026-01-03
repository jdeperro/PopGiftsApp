/**
 * Mock Gift Card Service
 * 
 * This service mimics the NeoCurrency API for development.
 * Replace with real NeoCurrency client when API access is granted.
 */

export interface GiftCardMerchant {
  id: string;
  name: string;
  logo_url: string;
  categories: string[];
  min_value: number;
  max_value: number;
  currency: string;
  available: boolean;
  description?: string;
}

export interface GiftCard {
  id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  code: string;
  pin: string;
  redemption_url: string;
  wallet_pass_url: string;
  qr_code_url: string;
  expires_at: string;
  status: 'active' | 'redeemed' | 'expired';
  created_at: string;
}

export interface ProductGiftCard extends GiftCard {
  product_url: string;
  product_name: string;
  product_image_url: string;
  cart_preload_url: string;
  allow_cash_conversion: boolean;
}

export class MockGiftCardService {
  private mockCatalog: GiftCardMerchant[] = [
    {
      id: 'amazon',
      name: 'Amazon',
      logo_url: 'https://logo.clearbit.com/amazon.com',
      categories: ['retail', 'electronics', 'books'],
      min_value: 1.00,
      max_value: 2000.00,
      currency: 'USD',
      available: true,
      description: 'Shop millions of products on Amazon'
    },
    {
      id: 'starbucks',
      name: 'Starbucks',
      logo_url: 'https://logo.clearbit.com/starbucks.com',
      categories: ['food', 'coffee', 'dining'],
      min_value: 5.00,
      max_value: 500.00,
      currency: 'USD',
      available: true,
      description: 'Coffee, tea, and more at Starbucks'
    },
    {
      id: 'target',
      name: 'Target',
      logo_url: 'https://logo.clearbit.com/target.com',
      categories: ['retail', 'home', 'clothing'],
      min_value: 10.00,
      max_value: 1000.00,
      currency: 'USD',
      available: true,
      description: 'Expect More. Pay Less.'
    },
    {
      id: 'walmart',
      name: 'Walmart',
      logo_url: 'https://logo.clearbit.com/walmart.com',
      categories: ['retail', 'grocery', 'electronics'],
      min_value: 5.00,
      max_value: 1000.00,
      currency: 'USD',
      available: true,
      description: 'Save Money. Live Better.'
    },
    {
      id: 'apple',
      name: 'Apple',
      logo_url: 'https://logo.clearbit.com/apple.com',
      categories: ['electronics', 'technology'],
      min_value: 25.00,
      max_value: 2000.00,
      currency: 'USD',
      available: true,
      description: 'For apps, games, music, and more'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      logo_url: 'https://logo.clearbit.com/spotify.com',
      categories: ['entertainment', 'music'],
      min_value: 10.00,
      max_value: 100.00,
      currency: 'USD',
      available: true,
      description: 'Music for everyone'
    },
    {
      id: 'netflix',
      name: 'Netflix',
      logo_url: 'https://logo.clearbit.com/netflix.com',
      categories: ['entertainment', 'streaming'],
      min_value: 25.00,
      max_value: 200.00,
      currency: 'USD',
      available: true,
      description: 'Watch TV shows and movies'
    },
    {
      id: 'uber',
      name: 'Uber',
      logo_url: 'https://logo.clearbit.com/uber.com',
      categories: ['transportation', 'food'],
      min_value: 15.00,
      max_value: 500.00,
      currency: 'USD',
      available: true,
      description: 'Rides and food delivery'
    },
    {
      id: 'doordash',
      name: 'DoorDash',
      logo_url: 'https://logo.clearbit.com/doordash.com',
      categories: ['food', 'delivery'],
      min_value: 15.00,
      max_value: 500.00,
      currency: 'USD',
      available: true,
      description: 'Food delivery from your favorite restaurants'
    },
    {
      id: 'sephora',
      name: 'Sephora',
      logo_url: 'https://logo.clearbit.com/sephora.com',
      categories: ['beauty', 'cosmetics'],
      min_value: 10.00,
      max_value: 500.00,
      currency: 'USD',
      available: true,
      description: 'Beauty products and cosmetics'
    },
    {
      id: 'nike',
      name: 'Nike',
      logo_url: 'https://logo.clearbit.com/nike.com',
      categories: ['sports', 'clothing', 'shoes'],
      min_value: 25.00,
      max_value: 500.00,
      currency: 'USD',
      available: true,
      description: 'Athletic shoes and apparel'
    },
    {
      id: 'bestbuy',
      name: 'Best Buy',
      logo_url: 'https://logo.clearbit.com/bestbuy.com',
      categories: ['electronics', 'technology'],
      min_value: 15.00,
      max_value: 2000.00,
      currency: 'USD',
      available: true,
      description: 'Electronics and appliances'
    }
  ];

  /**
   * Get full gift card catalog
   */
  async getCatalog(): Promise<{ merchants: GiftCardMerchant[] }> {
    // Simulate API delay
    await this.delay(100);
    return { merchants: this.mockCatalog };
  }

  /**
   * Search gift cards by query and/or category
   */
  async searchGiftCards(
    query?: string,
    category?: string
  ): Promise<{ merchants: GiftCardMerchant[] }> {
    await this.delay(100);

    let results = this.mockCatalog;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        m =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.description?.toLowerCase().includes(lowerQuery) ||
          m.categories.some(c => c.toLowerCase().includes(lowerQuery))
      );
    }

    if (category) {
      results = results.filter(m =>
        m.categories.includes(category.toLowerCase())
      );
    }

    return { merchants: results };
  }

  /**
   * Get merchant by ID
   */
  async getMerchant(merchantId: string): Promise<GiftCardMerchant | null> {
    await this.delay(50);
    return this.mockCatalog.find(m => m.id === merchantId) || null;
  }

  /**
   * Issue a standard gift card
   */
  async issueGiftCard(
    merchantId: string,
    amount: number,
    recipientEmail: string,
    metadata?: Record<string, any>
  ): Promise<{ gift_card: GiftCard }> {
    await this.delay(200);

    const merchant = await this.getMerchant(merchantId);
    if (!merchant) {
      throw new Error(`Merchant ${merchantId} not found`);
    }

    if (amount < merchant.min_value || amount > merchant.max_value) {
      throw new Error(
        `Amount must be between $${merchant.min_value} and $${merchant.max_value}`
      );
    }

    const giftCardId = `gc_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const giftCard: GiftCard = {
      id: giftCardId,
      merchant_id: merchantId,
      merchant_name: merchant.name,
      amount: amount,
      currency: 'USD',
      code: this.generateMockCode(),
      pin: this.generateMockPin(),
      redemption_url: `https://mock-redemption.com/${merchantId}?code=${giftCardId}`,
      wallet_pass_url: `https://mock-wallet.com/pass/${giftCardId}`,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${giftCardId}`,
      expires_at: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'active',
      created_at: new Date().toISOString()
    };

    console.log('🎁 Mock gift card issued:', {
      merchant: merchant.name,
      amount: `$${amount}`,
      code: giftCard.code,
      recipient: recipientEmail
    });

    return { gift_card: giftCard };
  }

  /**
   * Issue a product-specific gift card (for Amazon/Walmart feature)
   */
  async issueProductGiftCard(
    merchantId: string,
    productUrl: string,
    recipientEmail: string,
    metadata?: Record<string, any>
  ): Promise<{ gift_card: ProductGiftCard }> {
    await this.delay(200);

    const merchant = await this.getMerchant(merchantId);
    if (!merchant) {
      throw new Error(`Merchant ${merchantId} not found`);
    }

    // Extract product info from URL (mock)
    const productName = this.extractProductName(productUrl);
    const estimatedPrice = this.estimateProductPrice(productUrl);

    const standardGiftCard = await this.issueGiftCard(
      merchantId,
      estimatedPrice,
      recipientEmail,
      metadata
    );

    const productGiftCard: ProductGiftCard = {
      ...standardGiftCard.gift_card,
      product_url: productUrl,
      product_name: productName,
      product_image_url: `https://via.placeholder.com/300x300?text=${encodeURIComponent(productName)}`,
      cart_preload_url: `${productUrl}?gift_card=${standardGiftCard.gift_card.id}`,
      allow_cash_conversion: true
    };

    console.log('🎁 Mock product gift card issued:', {
      merchant: merchant.name,
      product: productName,
      amount: `$${estimatedPrice}`,
      recipient: recipientEmail
    });

    return { gift_card: productGiftCard };
  }

  /**
   * Get gift card balance
   */
  async getBalance(giftCardId: string): Promise<{ balance: number; currency: string }> {
    await this.delay(100);
    
    // Mock: return random balance between 0 and original amount
    const mockBalance = Math.random() * 100;
    
    return {
      balance: parseFloat(mockBalance.toFixed(2)),
      currency: 'USD'
    };
  }

  /**
   * Generate wallet pass (Apple/Google)
   */
  async getWalletPass(
    giftCardId: string,
    platform: 'apple' | 'google'
  ): Promise<{ pass_url: string; download_url: string }> {
    await this.delay(150);

    return {
      pass_url: `https://mock-wallet.com/${platform}/${giftCardId}`,
      download_url: `https://mock-wallet.com/download/${platform}/${giftCardId}`
    };
  }

  /**
   * Recommend gift cards based on interests
   */
  async recommendGiftCards(
    interests: string[],
    occasion?: string,
    limit: number = 3
  ): Promise<{ merchants: GiftCardMerchant[] }> {
    await this.delay(100);

    // Simple recommendation logic based on keywords
    const recommendations = this.mockCatalog.filter(merchant => {
      const merchantText = `${merchant.name} ${merchant.description} ${merchant.categories.join(' ')}`.toLowerCase();
      
      return interests.some(interest =>
        merchantText.includes(interest.toLowerCase())
      );
    });

    // If no matches, return popular ones
    if (recommendations.length === 0) {
      return {
        merchants: this.mockCatalog.slice(0, limit)
      };
    }

    return {
      merchants: recommendations.slice(0, limit)
    };
  }

  // Helper methods

  private generateMockCode(): string {
    return Array(4)
      .fill(0)
      .map(() =>
        Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()
      )
      .join('-');
  }

  private generateMockPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private extractProductName(url: string): string {
    // Mock product name extraction
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1] || 'Product';
    return lastPart
      .replace(/-/g, ' ')
      .replace(/\?.*/, '')
      .substring(0, 50);
  }

  private estimateProductPrice(url: string): number {
    // Mock price estimation (random between $20-$200)
    return parseFloat((20 + Math.random() * 180).toFixed(2));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const mockGiftCardService = new MockGiftCardService();
