/**
 * AIService — centralized AI integration for ndotoniWeb property creation/editing.
 *
 * Provides:
 * - Title generation (compelling, sellable titles)
 * - Description generation (experience-first copy)
 * - Price prediction (market-aware pricing for Tanzania)
 *
 * All methods call internal API routes (API key stays server-side).
 */

export interface GenerateTitleInput {
  propertyType: string;
  district: string;
  region: string;
  bedrooms?: number;
  monthlyRent?: number;
  nightlyRate?: number;
  currency?: string;
  rentalType: 'long-term' | 'short-term';
  userContext?: string;
}

export interface GenerateDescriptionInput {
  title: string;
  propertyType: string;
  district: string;
  region: string;
  bedrooms?: number;
  monthlyRent?: number;
  nightlyRate?: number;
  currency?: string;
  amenities?: string[];
  rentalType: 'long-term' | 'short-term';
  userContext?: string;
}

export interface PredictPriceInput {
  propertyType: string;
  district: string;
  region: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  rentalType: 'long-term' | 'short-term';
  userContext?: string;
}

export interface PricePrediction {
  suggestedPrice: number;
  currency: string;
  reasoning: string;
  range: { min: number; max: number };
}

class AIServiceClass {
  /**
   * Generate a catchy, sellable property listing title
   */
  async generateTitle(input: GenerateTitleInput): Promise<string> {
    const res = await fetch('/api/ai/generate-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error('Failed to generate title');
    }

    const data = await res.json();
    return data.title || '';
  }

  /**
   * Generate a compelling property description
   */
  async generateDescription(input: GenerateDescriptionInput): Promise<string> {
    const res = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await res.json();
    return data.description || '';
  }

  /**
   * Predict a competitive price based on property attributes and location
   */
  async predictPrice(input: PredictPriceInput): Promise<PricePrediction> {
    const res = await fetch('/api/ai/predict-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error('Failed to predict price');
    }

    return res.json();
  }
}

export const AIService = new AIServiceClass();
