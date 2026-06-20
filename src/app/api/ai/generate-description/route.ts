import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  try {
    const { title, propertyType, district, region, bedrooms, monthlyRent, nightlyRate, currency, amenities, rentalType, userContext } = await request.json();

    const isShortTerm = rentalType === 'short-term';
    const contextLine = userContext ? `\nAdditional context from the host: "${userContext}"\nIncorporate these details.\n` : '';

    const prompt = `You are a professional ${isShortTerm ? 'vacation rental' : 'long-term rental'} copywriter for the Tanzania market. Write a compelling property description that converts browsers into ${isShortTerm ? 'bookers' : 'tenants'}.

Property details:
- Title: ${title}
- Type: ${propertyType}
- Location: ${district}, ${region}
- Bedrooms: ${bedrooms || 'not specified'}
${isShortTerm && nightlyRate ? `- Price: ${currency || 'TZS'} ${nightlyRate}/night` : ''}
${!isShortTerm && monthlyRent ? `- Price: ${currency || 'TZS'} ${monthlyRent}/month` : ''}
${amenities?.length ? `- Amenities: ${amenities.join(', ')}` : ''}
${contextLine}
DESCRIPTION WRITING RULES:
- 2-3 sentences, maximum 250 characters
- First sentence: paint a picture — what's the EXPERIENCE/LIFESTYLE like?
- Second sentence: highlight 1-2 standout features
- Third sentence (optional): proximity to key amenities/transport/work
- Write in English
- Use sensory/lifestyle language
${isShortTerm ? `- Tone: vacation, escape, relaxation, experience
- "wake up to ocean breezes", "unwind on the private terrace"` : `- Tone: home, comfort, convenience, lifestyle
- "come home to quiet evenings", "minutes from the office", "secure family compound"`}

DO NOT:
- Start with "Welcome to..." or "This is a..."
- List amenities as a flat sentence
- Use superlatives you can't prove
- Mention the host

GOOD EXAMPLES:
${isShortTerm ? `- "A sun-drenched penthouse where city skyline meets ocean horizon. Fully equipped kitchen, fast WiFi, and a rooftop lounge perfect for sundowners."
- "Your private beach escape — fall asleep to waves and wake up steps from white sand."` : `- "A peaceful family compound tucked away from Bagamoyo Road's bustle. Reliable water, backup generator, and a garden where kids can play safely."
- "Modern living in the heart of Mikocheni — walk to shops, restaurants, and the office in minutes."`}

Just return the description text, nothing else.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
    }

    const data = await response.json();
    const description = data.content?.[0]?.text?.trim() || '';

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Description generation error:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
