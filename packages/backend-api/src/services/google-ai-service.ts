/**
 * Google AI Service
 * 
 * Handles AI card generation using Google Gemini and Imagen
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from multiple possible locations
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

export interface MadlibInput {
  recipient_name: string;
  occasion: string;
  age?: number;
  interests: string[];
  style?: string;
  message?: string;
  recipient_image?: string;
}

export interface CardDesign {
  id: string;
  image_url: string;
  prompt_used: string;
  style: string;
  created_at: string;
}

class GoogleAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private textModel: string = '';
  private imageModel: string = '';
  private initialized: boolean = false;

  private initialize() {
    if (this.initialized) return;
    
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  GOOGLE_AI_API_KEY not configured - AI features will not work');
      this.genAI = null;
      this.textModel = '';
      this.imageModel = '';
      this.initialized = true;
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.textModel = process.env.GOOGLE_TEXT_MODEL || 'gemini-2.5-flash';
    this.imageModel = process.env.GOOGLE_IMAGE_MODEL || 'imagen-3';
    this.initialized = true;
    
    console.log('✅ Google AI Service initialized successfully');
    console.log(`   Text Model: ${this.textModel}`);
    console.log(`   Image Model: ${this.imageModel}`);
  }

  private ensureInitialized() {
    this.initialize();
    if (!this.genAI) {
      throw new Error('Google AI service not initialized - check GOOGLE_AI_API_KEY');
    }
  }

  /**
   * Generate card designs from madlib input
   * Returns 3 design variations
   */
  async generateCardDesigns(input: MadlibInput): Promise<CardDesign[]> {
    this.ensureInitialized();
    
    console.log('\n🎨 Generating card designs...');
    console.log(`   Recipient: ${input.recipient_name}`);
    console.log(`   Occasion: ${input.occasion}`);
    console.log(`   Interests: ${input.interests.join(', ')}`);

    // Step 1: Generate image prompts using Gemini
    const prompts = await this.generateImagePrompts(input);

    // Step 2: Generate images (mock for now - Imagen requires Vertex AI setup)
    const designs = await Promise.all(
      prompts.map((prompt, index) => this.createCardDesign(prompt, index, input))
    );

    console.log(`✅ Generated ${designs.length} card designs`);
    return designs;
  }

  /**
   * Generate 3 image prompts using Gemini
   */
  private async generateImagePrompts(input: MadlibInput): Promise<string[]> {
    this.ensureInitialized();
    const model = this.genAI!.getGenerativeModel({ model: this.textModel });

    const systemPrompt = `You are an expert at creating detailed image generation prompts for greeting cards.
Create 3 different, creative prompts for generating a ${input.occasion} card for ${input.recipient_name}.

Consider:
- Recipient's interests: ${input.interests.join(', ')}
- Age: ${input.age || 'not specified'}
- Style: ${input.style || 'modern and colorful'}

Each prompt should be:
- Detailed and specific
- Visually descriptive
- Appropriate for the occasion
- Different from the others (vary themes, colors, compositions)
- Suitable for a greeting card format (vertical, celebratory)

Return ONLY the 3 prompts, one per line, numbered 1-3.`;

    try {
      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const text = response.text();

      // Parse the 3 prompts
      const prompts = text
        .split('\n')
        .filter(line => line.trim().match(/^\d+[.):]/))
        .map(line => line.replace(/^\d+[.):]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3);

      if (prompts.length < 3) {
        // Fallback prompts if parsing fails
        return this.getFallbackPrompts(input);
      }

      console.log('✅ Generated image prompts');
      return prompts;
    } catch (error) {
      console.error('Error generating prompts:', error);
      return this.getFallbackPrompts(input);
    }
  }

  /**
   * Create a card design (mock image generation for now)
   */
  private async createCardDesign(
    prompt: string,
    index: number,
    input: MadlibInput
  ): Promise<CardDesign> {
    // TODO: Implement real Imagen API call via Vertex AI
    // For now, use placeholder images
    
    const designId = `card_${Date.now()}_${index}`;
    
    // Use placeholder image service with the prompt as text
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
    const imageUrl = `https://via.placeholder.com/800x1000/4A90E2/FFFFFF?text=${encodedPrompt}`;

    return {
      id: designId,
      image_url: imageUrl,
      prompt_used: prompt,
      style: input.style || 'modern',
      created_at: new Date().toISOString()
    };
  }

  /**
   * Generate a heartfelt message using Gemini
   */
  async generateMessage(input: MadlibInput): Promise<string> {
    this.ensureInitialized();
    const model = this.genAI!.getGenerativeModel({ model: this.textModel });

    const prompt = `Write a short, heartfelt ${input.occasion} message for ${input.recipient_name}.
${input.age ? `They are turning ${input.age} years old.` : ''}
${input.interests.length > 0 ? `They love: ${input.interests.join(', ')}.` : ''}

The message should be:
- Warm and personal
- 2-3 sentences maximum
- Appropriate for the occasion
- Genuine and heartfelt

Return ONLY the message, no quotes or extra text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const message = response.text().trim();

      console.log('✅ Generated message');
      return message;
    } catch (error) {
      console.error('Error generating message:', error);
      return `Happy ${input.occasion}, ${input.recipient_name}! Wishing you all the best!`;
    }
  }

  /**
   * Test the connection
   */
  async testConnection(): Promise<boolean> {
    try {
      this.ensureInitialized();
      const model = this.genAI!.getGenerativeModel({ model: this.textModel });
      const result = await model.generateContent('Say "Hello from Google AI!"');
      const response = result.response;
      console.log('✅ Google AI connection test successful');
      console.log(`   Response: ${response.text()}`);
      return true;
    } catch (error) {
      console.error('❌ Google AI connection test failed:', error);
      return false;
    }
  }

  /**
   * Refine a card design based on user feedback
   */
  async refineCardDesign(
    originalPrompt: string,
    refinementRequest: string
  ): Promise<CardDesign> {
    this.ensureInitialized();
    const model = this.genAI!.getGenerativeModel({ model: this.textModel });

    const prompt = `Original image prompt: "${originalPrompt}"

User wants to refine it: "${refinementRequest}"

Create a new, improved image prompt that incorporates the user's feedback.
Return ONLY the new prompt, no explanation.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const newPrompt = response.text().trim();

      return this.createCardDesign(newPrompt, 0, {
        recipient_name: '',
        occasion: '',
        interests: []
      });
    } catch (error) {
      console.error('Error refining design:', error);
      throw error;
    }
  }

  /**
   * Check grammar and spelling
   */
  async checkGrammar(text: string): Promise<string> {
    this.ensureInitialized();
    const model = this.genAI!.getGenerativeModel({ model: this.textModel });

    const prompt = `Fix any grammar, spelling, or punctuation errors in this text.
Return ONLY the corrected text, no explanation.

Text: "${text}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error checking grammar:', error);
      return text; // Return original if error
    }
  }

  /**
   * Fallback prompts if AI generation fails
   */
  private getFallbackPrompts(input: MadlibInput): string[] {
    const occasion = input.occasion.toLowerCase();
    const interests = input.interests.join(', ');

    return [
      `A vibrant, modern ${occasion} card with colorful balloons, confetti, and celebration elements. Include themes related to ${interests}. Bright, joyful colors with a festive atmosphere.`,
      `An elegant ${occasion} card with a minimalist design, featuring soft pastel colors and delicate decorations. Subtle references to ${interests}. Clean, sophisticated style.`,
      `A playful, fun ${occasion} card with bold colors and dynamic composition. Incorporate elements of ${interests} in a creative way. Energetic and cheerful mood.`
    ];
  }
}

// Export singleton instance (lazy initialization)
let instance: GoogleAIService | null = null;

export function getGoogleAIService(): GoogleAIService {
  if (!instance) {
    instance = new GoogleAIService();
  }
  return instance;
}

export const googleAIService = getGoogleAIService();
export default googleAIService;