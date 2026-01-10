/**
 * Card Types
 * Basic interfaces for card generation system
 */

export interface MadlibInput {
  [key: string]: string;
}

export interface LayerTree {
  id: string;
  type: 'container' | 'text' | 'image' | 'shape';
  content?: string;
  style?: {
    [key: string]: any;
  };
  children?: LayerTree[];
}

export interface IllustrationRequest {
  freeformPrompt: string;
  occasion: string;
  recipientName?: string;
  interests: string[];
  style: string;
}

export interface IllustrationResult {
  success: boolean;
  layerTree?: LayerTree;
  variations?: LayerTree[];
  error?: string;
}

export interface EditResult {
  success: boolean;
  layerTree?: LayerTree;
  error?: string;
}

export interface GiftResult {
  giftCards: any[];
  suggestedFriends: any[];
}