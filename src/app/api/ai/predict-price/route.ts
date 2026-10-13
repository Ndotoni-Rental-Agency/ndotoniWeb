import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  try {
    const { propertyType, district, region, bedrooms, bathrooms, amenities, userContext } = await request.json();

    const contextLine = userContext ? `\nAdditional context from the host: "${userContext}"\nFactor this into pricing.\n` : '';

    const prompt = `You are a pricing analyst for Tanzania's long-term rental market.
Suggest a competitive monthly rate in TZS.

Property details:
- Type: ${propertyType}
- Location: ${district}, ${region}
- Bedrooms: ${bedrooms || 1}
- Bathrooms: ${bathrooms || 1}
${amenities?.length ? `- Amenities: ${amenities.join(', ')}` : ''}
${contextLine}
TANZANIA RENTAL PRICING KNOWLEDGE (2024-2025):

LONG-TERM (MONTHLY) RATES:

PREMIUM AREAS:
- Masaki, Oyster Bay, Peninsula: TZS 1,500,000-5,000,000+/month
- Msasani, Mikocheni A: TZS 800,000-2,500,000/month
- Mbezi Beach, Kawe: TZS 500,000-1,500,000/month

MID-RANGE:
- Kinondoni, Sinza, Kijitonyama: TZS 200,000-600,000/month
- Kimara, Ubungo, Tegeta: TZS 150,000-400,000/month
- Mikocheni B, Mwenge: TZS 300,000-800,000/month

BUDGET:
- Temeke, Ilala, Manzese: TZS 80,000-250,000/month
- Peripheral areas: TZS 50,000-150,000/month

PROPERTY TYPE MULTIPLIERS:
- House (standalone): 1.5-2x apartment rate
- Apartment: base rate
- Studio/bedsitter: 0.5-0.7x apartment
- Room: 0.3-0.5x apartment
- Commercial: varies widely by location

BEDROOM SCALING:
- 1BR: base
- 2BR: +40-60%
- 3BR: +80-120%
- 4BR+: +150-200%

AMENITY PREMIUMS:
- Furnished: +30-50%, Generator: +15-25%, Compound/security: +10-20%

Never below TZS 50,000/month. Round to nearest 10,000.

Respond ONLY with valid JSON:
{"suggestedPrice": 500000, "currency": "TZS", "reasoning": "Brief 1-sentence explanation", "range": {"min": 350000, "max": 700000}}`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to predict price' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim() || '';

    try {
      const cleaned = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      console.error('Failed to parse AI response:', text);
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Price prediction error:', error);
    return NextResponse.json({ error: 'Failed to predict price' }, { status: 500 });
  }
}
