/**
 * Orchestration Agent
 * Coordinates the multi-agent workflow for card generation
 * Uses Google AI (Gemini + Imagen) for all AI operations
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { IllustratorAgent } from './illustrator-agent';
import { EditorAgent } from './editor-agent';
import { AnimatorAgent } from './animator-agent';
import { GiftAgent } from './gift-agent';
import { MadlibInput, LayerTree } from '../types/card';

// State that flows through the agent workflow
export interface CardGenerationState {
  // Input
  prompt: string;
  madlibInput?: MadlibInput;
  userId?: string;
  
  // Analysis
  analysis?: PromptAnalysis;
  
  // Generated content
  layerTree?: LayerTree;
  variations?: LayerTree[];
  
  // Recommendations
  giftRecommendations?: GiftRecommendation[];
  suggestedFriends?: SuggestedFriend[];
  
  // Workflow tracking
  currentStep: string;
  errors: string[];
  startTime: number;
}

export interface PromptAnalysis {
  occasion: string;
  recipient?: string;
  age?: number;
  interests: string[];
  tone: 'celebratory' | 'elegant' | 'playful' | 'romantic' | 'professional';
  illustrationStyle: 'anime' | 'watercolor' | 'lineart' | 'oilpainting' | 'cartoon';
}

export interface GiftRecommendation {
  merchant: string;
  amount: number;
  reason: string;
  relevance: number;
}

export interface SuggestedFriend {
  name: string;
  phone: string;
  relationship: string;
  reason: string;
  likelihood: 'high' | 'medium' | 'low';
}

export class OrchestrationAgent {
  private genAI: GoogleGenerativeAI;
  private illustrator: IllustratorAgent;
  private editor: EditorAgent;
  private animator: AnimatorAgent;
  private giftAgent: GiftAgent;
  
  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.illustrator = new IllustratorAgent();
    this.editor = new EditorAgent();
    this.animator = new AnimatorAgent();
    this.giftAgent = new GiftAgent();
    
    console.log('🎯 Orchestration Agent initialized');
  }
  
  /**
   * Main workflow: Generate complete card with all features
   */
  async generateCard(prompt: string, userId?: string): Promise<CardGenerationState> {
    const state: CardGenerationState = {
      prompt,
      userId,
      currentStep: 'start',
      errors: [],
      startTime: Date.now()
    };
    
    try {
      console.log('🎯 Starting card generation workflow...');
      
      // Step 1: Analyze prompt
      state.currentStep = 'analyzing';
      state.analysis = await this.analyzePrompt(prompt);
      console.log(`✅ Analysis complete: ${state.analysis.occasion} card, ${state.analysis.illustrationStyle} style`);
      
      // Step 2: Generate layer structure (Illustrator Agent)
      state.currentStep = 'illustrating';
      const illustrationResult = await this.illustrator.generateDesign({
        freeformPrompt: prompt,
        occasion: state.analysis.occasion,
        recipientName: state.analysis.recipient,
        interests: state.analysis.interests,
        style: state.analysis.illustrationStyle
      });
      
      if (!illustrationResult.success || !illustrationResult.layerTree) {
        throw new Error('Illustration generation failed');
      }
      
      state.layerTree = illustrationResult.layerTree;
      state.variations = illustrationResult.variations || [];
      console.log(`✅ Illustration complete: ${state.variations.length} variations generated`);
      
      // Step 3: Refine text (Editor Agent)
      state.currentStep = 'editing';
      const editResult = await this.editor.refineTextLayers(
        state.layerTree,
        state.analysis
      );
      
      if (editResult.success && editResult.layerTree) {
        state.layerTree = editResult.layerTree;
        console.log('✅ Text refinement complete');
      }
      
      // Step 4: Add animations (Animator Agent)
      state.currentStep = 'animating';
      const animatedTree = await this.animator.addAnimations(
        state.layerTree,
        state.analysis
      );
      
      state.layerTree = animatedTree;
      console.log('✅ Animations added');
      
      // Step 5: Get gift recommendations (Gift Agent) - runs in parallel
      state.currentStep = 'shopping';
      if (userId) {
        const giftResult = await this.giftAgent.recommendGifts(
          state.analysis,
          userId
        );
        
        state.giftRecommendations = giftResult.giftCards;
        state.suggestedFriends = giftResult.suggestedFriends;
        console.log(`✅ Gift recommendations: ${state.giftRecommendations?.length || 0} cards, ${state.suggestedFriends?.length || 0} friends`);
      }
      
      // Complete
      state.currentStep = 'complete';
      const duration = ((Date.now() - state.startTime) / 1000).toFixed(2);
      console.log(`🎉 Card generation complete in ${duration}s`);
      
    } catch (error: any) {
      console.error('❌ Orchestration error:', error);
      state.errors.push(error.message);
      state.currentStep = 'failed';
    }
    
    return state;
  }
  
  /**
   * Analyze user prompt to extract key information
   * FIXED: Use environment variable instead of hardcoded model name
   */
  private async analyzePrompt(prompt: string): Promise<PromptAnalysis> {
    const textModel = process.env.GOOGLE_TEXT_MODEL || 'models/gemini-2.5-flash';
    const model = this.genAI.getGenerativeModel({ 
      model: textModel
    });
    
    const analysisPrompt = `Analyze this greeting card prompt and extract key information:

"${prompt}"

Return a JSON object with:
- occasion: string (birthday, anniversary, thank you, congratulations, etc.)
- recipient: string (name if mentioned, otherwise null)
- age: number (if mentioned, otherwise null)
- interests: string[] (hobbies, likes, themes mentioned)
- tone: string (celebratory, elegant, playful, romantic, or professional)
- illustrationStyle: string (anime, watercolor, lineart, oilpainting, or cartoon)

Choose the illustration style that best matches the occasion and tone.
Return ONLY valid JSON, no markdown or extra text.`;
    
    try {
      const result = await model.generateContent(analysisPrompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up response (remove markdown code blocks if present)
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(jsonText);
      
      // Validate and set defaults
      return {
        occasion: analysis.occasion || 'celebration',
        recipient: analysis.recipient || undefined,
        age: analysis.age || undefined,
        interests: Array.isArray(analysis.interests) ? analysis.interests : [],
        tone: analysis.tone || 'celebratory',
        illustrationStyle: analysis.illustrationStyle || 'cartoon'
      };
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      
      // Fallback analysis
      return {
        occasion: 'celebration',
        interests: [],
        tone: 'celebratory',
        illustrationStyle: 'cartoon'
      };
    }
  }
  
  /**
   * Get agent status
   */
  getStatus() {
    return {
      status: 'healthy',
      agents: {
        orchestration: 'active',
        illustrator: this.illustrator.getStatus(),
        editor: 'active',
        animator: 'active',
        gift: 'active'
      }
    };
  }
}