import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  try {
    const { propertyType, district, region, bedrooms, monthlyRent, nightlyRate, currency, rentalType, userContext } = await request.json();

    const isShortTerm = rentalType === 'short-term';
    const contextLine = userContext ? `\nAdditional context from the host: "${userContext}"\nUse this to make the title more specific and relevant.\n` : '';

    const prompt = `You are a top-tier rental property copywriter specializing in Tanzania's ${isShortTerm ? 'short-term vacation rental' : 'long-term rental'} market.
Generate an irresistible property listing title.

Property details:
- Type: ${propertyType || 'HOUSE'}
- Location: ${district || region || 'Dar es Salaam'}
- Bedrooms: ${bedrooms || 'not specified'}
${isShortTerm && nightlyRate ? `- Nightly rate: ${currency || 'TZS'} ${nightlyRate}` : ''}
${!isShortTerm && monthlyRent ? `- Monthly rent: ${currency || 'TZS'} ${monthlyRent}` : ''}
${contextLine}
TITLE WRITING RULES:
- Maximum 60 characters
- MUST be in English
- Lead with the most compelling feature or feeling
- Include the specific area/neighborhood
- Use power words that evoke emotion: "Spacious", "Modern", "Serene", "Cozy", "Bright", "Elegant"
${isShortTerm ? `- Match tone to vacation/getaway vibes: "Retreat", "Hideaway", "Oasis", "Oceanfront", "Rooftop"` : `- Match tone to home/living vibes: "Spacious", "Family-friendly", "Quiet", "Well-maintained", "Secure"`}
- Property type language:
  • Villa/House: "Spacious", "Private", "Family-friendly", capacity highlights
  • Apartment/Studio: "Modern", "Chic", "City views", walkability
  • Room: "Cozy", "Private", proximity to work/transport
  • Commercial: "Prime location", "High traffic", purpose
- DO NOT use: "Beautiful", "Nice", "Good", "Great" (too generic)
- DO NOT use ALL CAPS or excessive punctuation
- DO NOT include the price in the title
- DO NOT wrap in quotes

GOOD EXAMPLES:
${isShortTerm ? `- "Oceanfront Villa with Pool in Masaki"
- "Chic Penthouse · Rooftop Terrace · Oyster Bay"
- "Private Safari Lodge · Arusha Gateway"
- "Modern 3BR Apartment in the Heart of Mikocheni"` : `- "Spacious 3BR Family Home in Mikocheni"
- "Modern Studio with 24/7 Security · Sinza"
- "Quiet 2BR Apartment near Mlimani City"
- "Furnished Room with WiFi · Kijitonyama"`}

Just return the title text, nothing else.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
    }

    const data = await response.json();
    const title = data.content?.[0]?.text?.trim() || '';

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Title generation error:', error);
    return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
  }
}
