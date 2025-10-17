# Anam AI API Analysis & Integration Guide

## Overview
Anam AI provides a real-time digital persona platform with WebRTC-based video streaming capabilities. This document outlines the API structure, authentication flow, and integration requirements for developing a POC.

---

## 1. Authentication & API Endpoints

### Base API URL
```
https://api.anam.ai/v1/
```

### Session Token Endpoint
**Endpoint:** `POST https://api.anam.ai/v1/auth/session-token`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "personaConfig": {
    "name": "Sofia",
    "avatarId": "avatar-id",
    "voiceId": "voice-id",
    "llmId": "llm-id",
    "systemPrompt": "Your persona instructions"
  }
}
```

**Response:**
```json
{
  "sessionToken": "short-lived-token-string"
}
```

**⚠️ BREAKING CHANGE:** As of SDK v4.x, persona configuration must be included in the POST request body when creating session tokens. Legacy tokens without embedded persona config are no longer supported.

**Security Best Practice:**
- **Development:** Can use `unsafe_createClientWithApiKey()` (not recommended for production)
- **Production:** Exchange API key for session token server-side, pass token to client

---

## 2. JavaScript SDK (@anam-ai/js-sdk)

### Installation
```bash
npm install @anam-ai/js-sdk
```

**Current Version:** 3.5.1

### SDK Documentation
- Full docs: https://docs.anam.ai
- GitHub: https://github.com/anam-org/javascript-sdk
- npm: https://www.npmjs.com/package/@anam-ai/js-sdk

---

## 3. Integration Methods

### Method 1: Development Mode (Unsafe)
```javascript
import { unsafe_createClientWithApiKey } from '@anam-ai/js-sdk';

const anamClient = unsafe_createClientWithApiKey('your-api-key', {
  name: 'Cara',
  avatarId: 'avatar-id-from-gallery',
  voiceId: 'voice-id-from-gallery',
  llmId: 'ANAM_GPT_4O_MINI_V1', // brainType is deprecated
  systemPrompt: '[STYLE] Natural speech... [PERSONALITY] Helpful assistant'
});

// Stream to video element
anamClient.streamToVideoElement('video-element-id');
```

**⚠️ WARNING:** This method exposes your API key client-side. Only use for local development.

### Method 2: Production Mode (Recommended)

#### Server-Side (Node.js/Express example)
```javascript
// server.js
app.post('/api/anam-session', async (req, res) => {
  try {
    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ANAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personaConfig: {
          name: 'Cara',
          avatarId: 'avatar-id',
          voiceId: 'voice-id',
          llmId: 'ANAM_GPT_4O_MINI_V1',
          systemPrompt: 'Your custom prompt here'
        }
      })
    });

    const { sessionToken } = await response.json();
    res.json({ sessionToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate session token' });
  }
});
```

#### Client-Side
```javascript
import { createClient } from '@anam-ai/js-sdk';

// Fetch session token from your backend (persona config is embedded in token)
const response = await fetch('/api/anam-session', { method: 'POST' });
const { sessionToken } = await response.json();

// Initialize Anam client (no persona config needed here)
const anamClient = createClient(sessionToken);

// Stream to video element
anamClient.streamToVideoElement('video-element-id');
```

---

## 4. SDK Methods

### Core Methods
| Method | Description |
|--------|-------------|
| `createClient(sessionToken)` | Initialize client with session token (persona config embedded in token) |
| `unsafe_createClientWithApiKey(apiKey, config)` | Initialize client with API key (development only) |
| `streamToVideoElement(elementId)` | Start streaming persona to HTML video element |
| `stopStreaming()` | End current streaming session |
| `addListener(event, callback)` | Register event listener |

**⚠️ IMPORTANT:** As of SDK v4.x, `createClient()` only accepts a session token. Persona configuration must be included in the session token POST request body on the server-side.

---

## 5. Event System

### Available Events
| Event | Description |
|-------|-------------|
| `CONNECTION_ESTABLISHED` | Fired when WebRTC connection is established |
| `CONNECTION_CLOSED` | Fired when connection is closed or network issue occurs |
| `MESSAGE_HISTORY_UPDATED` | Fired when conversation message history updates |

### Event Listener Example
```javascript
import { AnamEvent } from '@anam-ai/js-sdk';

anamClient.addListener(AnamEvent.CONNECTION_ESTABLISHED, () => {
  console.log('Connected to Anam persona');
});

anamClient.addListener(AnamEvent.CONNECTION_CLOSED, () => {
  console.log('Connection closed');
});

anamClient.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages) => {
  console.log('Message history:', messages);
});
```

---

## 6. Persona Configuration

### Required Configuration Fields
```typescript
interface PersonaConfig {
  name: string;           // Display name for the persona
  avatarId: string;       // ID from Anam Avatar Gallery
  voiceId: string;        // ID from Anam Voice Gallery
  llmId: string;          // Language model ID
  systemPrompt: string;   // Instructions for persona behavior
}
```

### Wynter POC Configuration
```javascript
{
  name: 'Sofia',
  avatarId: '6dbc1e47-7768-403e-878a-94d7fcc3677b',
  voiceId: '3e119786-d834-448f-96a2-20c1b5469eb4',
  llmId: '0934d97d-0c3a-4f33-91b0-5e136a0ef466',
  systemPrompt: `[ROLE]
You are a world-class qualitative and quantitative researcher specialized in B2B market research. Your goal is to uncover meaningful insights by asking precise, well-structured questions and interpreting information with accuracy. Use both open-ended and targeted probing to clarify context, uncover motivations, and validate assumptions. Be objective, analytical, and thorough, while still keeping the interaction natural and conversational. Present findings clearly, avoid jargon, and when useful, draw on examples from real-world business cases. Always aim to reveal insights that guide smarter business decisions, not overwhelm with data.

[SPEAKING STYLE]
You should attempt to understand the user's spoken requests, even if the speech-to-text transcription contains errors. Your responses will be converted to speech using a text-to-speech system. Therefore, your output must be plain, unformatted text.

When you receive a transcribed user request:

Silently correct for likely transcription errors. Focus on the intended meaning, not the literal text.

Provide short, direct answers unless the user explicitly asks for more detail.

Always prioritize clarity and accuracy. Respond in plain text, without formatting, bullet lists, or extra conversational filler.

Occasionally add a pause "..." or disfluency e.g. "Um" or "Erm."

Your output will be directly converted to speech, so your response should be natural-sounding and appropriate for a spoken conversation.

[USEFUL CONTEXT]
• Typical B2B research objectives: market sizing, competitive benchmarking, product-market fit, customer segmentation, buying journey, value drivers.
• Qualitative methods: in-depth interviews, focus groups, workshops, ethnography, laddering techniques.
• Quantitative methods: surveys, conjoint analysis, discrete choice, regression, segmentation, factor analysis.
• Sample sizes: for robust quantitative results, aim for at least 100+ responses per segment (depending on client budget).
• Bias mitigation: use neutral wording, randomize question order, include control questions, test survey in pilot.
• Interview best practices: ask open questions first, probe deeper, avoid leading questions, keep interview under 60 minutes.
• Reporting: combine narrative, charts, and key metrics; highlight patterns, outliers, actionable insights.
• Example business case: "A SaaS company wants to understand why mid-market customers drop off after trial. Use mixed methods: survey + follow-up interviews to uncover motivations, friction points, and usage patterns."`
}
```

---

## 7. HTML Video Element Requirements

### Basic Setup
```html
<video
  id="anam-video"
  autoplay
  playsinline
  muted="false"
  style="width: 100%; max-width: 800px;"
></video>
```

**Required Attributes:**
- `autoplay`: Enables automatic playback when stream starts
- `playsinline`: Required for mobile Safari to play inline
- `id`: Reference for `streamToVideoElement()` method

---

## 8. Integration Requirements

### Frontend Requirements
- Modern browser with WebRTC support
- HTML video element
- JavaScript environment (React, Vue, vanilla JS, etc.)
- @anam-ai/js-sdk package

### Backend Requirements (Production)
- Server-side API key storage (environment variable)
- Endpoint to exchange API key for session token
- HTTPS endpoint (recommended for security)

### Browser Compatibility
- WebRTC support required
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile support with `playsinline` attribute

---

## 9. POC Implementation Recommendations

### Quick Start POC (Development)
1. Install SDK: `npm install @anam-ai/js-sdk`
2. Create simple HTML page with video element
3. Use `unsafe_createClientWithApiKey()` for rapid testing
4. Call `streamToVideoElement()` to start session

### Production-Ready POC
1. Set up Next.js/React application
2. Create API route for session token generation (`/api/anam-session`)
3. Store API key in `.env.local` (ANAM_API_KEY)
4. Create client component with video element
5. Fetch session token from API route
6. Initialize Anam client with `createClient()`
7. Add event listeners for connection status
8. Implement error handling and loading states

---

## 10. Next Steps for POC Development

### Phase 1: Basic Integration
- [ ] Set up Next.js project structure
- [ ] Install @anam-ai/js-sdk
- [ ] Create API route for session token
- [ ] Implement basic video component
- [ ] Test streaming connection

### Phase 2: Enhanced Features
- [ ] Add connection status indicators
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test on multiple browsers/devices
- [ ] Add session lifecycle management

### Phase 3: UI/UX Polish
- [ ] Design custom video player controls
- [ ] Add microphone permissions handling
- [ ] Implement graceful disconnection
- [ ] Add analytics/logging
- [ ] Performance optimization

---

## 11. Additional Resources

- **Main Documentation:** https://docs.anam.ai
- **API Reference:** https://docs.anam.ai/overview
- **GitHub SDK:** https://github.com/anam-org/javascript-sdk
- **Example Projects:** https://github.com/anam-org/anam-examples
- **Account Setup:** https://lab.anam.ai
- **npm Package:** https://www.npmjs.com/package/@anam-ai/js-sdk

---

## 12. Notes & Considerations

### Deprecation Warnings
- `brainType` field is deprecated, use `llmId` instead

### Security Considerations
- Never expose API key client-side in production
- Use HTTPS for all API communications
- Implement rate limiting on session token endpoint
- Set appropriate CORS policies

### WebRTC Considerations
- Requires user media permissions (microphone)
- May require STUN/TURN servers for NAT traversal
- Network quality affects streaming performance
- Consider bandwidth requirements

### Cost Considerations
- Session tokens are short-lived (check documentation for TTL)
- Each streaming session may incur API costs
- Consider implementing session timeout/limits

---

**Document Version:** 1.0
**Last Updated:** 2025-10-17
**Author:** Analysis for Wynter POC Integration
