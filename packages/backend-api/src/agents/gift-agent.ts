/**
 * Gift Agent (Stub)
 * Handles gift card recommendations and friend suggestions
 */

import { GiftResult } from '../types/card';

export class GiftAgent {
  constructor() {
    console.log('🎁 Gift Agent initialized (stub)');
  }

  async recommendGifts(analysis: any, userId: string): Promise<GiftResult> {
    console.log('🎁 Generating gift recommendations for user:', userId);
    
    // Return empty recommendations for now
    return {
      giftCards: [],
      suggestedFriends: []
    };
  }

  getStatus() {
    return 'active';
  }
}