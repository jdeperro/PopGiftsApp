/**
 * Gift Card Service
 * 
 * Wrapper service that switches between mock and real NeoCurrency API
 * based on environment configuration.
 */

import { mockGiftCardService, GiftCardMerchant, GiftCard, ProductGiftCard } from './mock-gift-card-service';

class GiftCardService {
  private useMock: boolean;

  constructor() {
    // Use mock service if NEOCURRENCY_SANDBOX is true or API key is not set
    this.useMock =
      process.env.NEOCURRENCY_SANDBOX === 'true' ||
      !process.env.NEOCURRENCY_API_KEY;

    if (this.useMock) {
      console.log('🎭 Using MOCK gift card service for development');
    } else {
      console.log('🎁 Using REAL NeoCurrency API');
    }
  }

  /**
   * Get full gift card catalog
   */
  async getCatalog(): Promise<{ merchants: GiftCardMerchant[] }> {
    if (this.useMock) {
      return mockGiftCardService.getCatalog();
    }

    // TODO: Implement real NeoCurrency API call
    // const response = await fetch(`${process.env.NEOCURRENCY_API_URL}/catalog`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.NEOCURRENCY_API_KEY}`
    //   }
    // });
    // return await response.json();

    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Search gift cards
   */
  async searchGiftCards(
    query?: string,
    category?: string
  ): Promise<{ merchants: GiftCardMerchant[] }> {
    if (this.useMock) {
      return mockGiftCardService.searchGiftCards(query, category);
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Get merchant by ID
   */
  async getMerchant(merchantId: string): Promise<GiftCardMerchant | null> {
    if (this.useMock) {
      return mockGiftCardService.getMerchant(merchantId);
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
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
    if (this.useMock) {
      return mockGiftCardService.issueGiftCard(
        merchantId,
        amount,
        recipientEmail,
        metadata
      );
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Issue a product-specific gift card
   */
  async issueProductGiftCard(
    merchantId: string,
    productUrl: string,
    recipientEmail: string,
    metadata?: Record<string, any>
  ): Promise<{ gift_card: ProductGiftCard }> {
    if (this.useMock) {
      return mockGiftCardService.issueProductGiftCard(
        merchantId,
        productUrl,
        recipientEmail,
        metadata
      );
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Get gift card balance
   */
  async getBalance(giftCardId: string): Promise<{ balance: number; currency: string }> {
    if (this.useMock) {
      return mockGiftCardService.getBalance(giftCardId);
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Generate wallet pass
   */
  async getWalletPass(
    giftCardId: string,
    platform: 'apple' | 'google'
  ): Promise<{ pass_url: string; download_url: string }> {
    if (this.useMock) {
      return mockGiftCardService.getWalletPass(giftCardId, platform);
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }

  /**
   * Recommend gift cards based on interests
   */
  async recommendGiftCards(
    interests: string[],
    occasion?: string,
    limit: number = 3
  ): Promise<{ merchants: GiftCardMerchant[] }> {
    if (this.useMock) {
      return mockGiftCardService.recommendGiftCards(interests, occasion, limit);
    }

    // TODO: Implement real NeoCurrency API call
    throw new Error('Real NeoCurrency API not yet implemented');
  }
}

// Export singleton instance
export const giftCardService = new GiftCardService();
export default giftCardService;
