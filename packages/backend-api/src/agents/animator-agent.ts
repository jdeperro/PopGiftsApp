/**
 * Animator Agent (Stub)
 * Adds animations and interactive elements to greeting cards
 */

import { LayerTree } from '../types/card';

export class AnimatorAgent {
  constructor() {
    console.log('🎬 Animator Agent initialized (stub)');
  }

  async addAnimations(layerTree: LayerTree, analysis: any): Promise<LayerTree> {
    console.log('🎬 Adding animations for style:', analysis?.illustrationStyle || 'default');
    
    // Return the layer tree as-is for now
    return layerTree;
  }

  getStatus() {
    return 'active';
  }
}