import { NextResponse } from 'next/server';
import { ANAM_API_CONFIG, ANAM_PERSONA_CONFIG } from '@/config/anam.config';

export async function POST() {
  try {
    const apiKey = process.env.ANAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANAM_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${ANAM_API_CONFIG.baseUrl}${ANAM_API_CONFIG.sessionTokenEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaConfig: ANAM_PERSONA_CONFIG
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anam API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate session token' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error('Session token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
