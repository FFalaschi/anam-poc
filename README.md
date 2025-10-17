# Wynter AI - Brand Tracking Survey POC

A Next.js application integrating Anam AI's digital persona platform to create Sofia, a professional brand tracking survey interviewer.

## Overview

This POC demonstrates real-time voice-based brand tracking surveys with Sofia, a specialized AI interviewer conducting structured research on B2B marketing research platforms. Built with Next.js 15, TypeScript, and the Anam AI SDK.

## Features

- ✨ Real-time WebRTC video streaming with AI interviewer
- 🎯 Structured 9-question brand tracking survey
- 📊 Brand awareness, consideration, and perception metrics
- 🔒 Secure server-side API key management
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with connection status indicators
- 💬 Natural conversational survey experience
- 🔄 Automatic error handling and reconnection

## Survey Content

**Research Focus:** Brand tracking study for B2B marketing research platforms

**Brands Evaluated:**
- Wynter
- Qualtrics
- Tremendous
- SurveyMonkey

**Survey Questions:**
1. Unaided brand awareness
2. Aided awareness & familiarity
3. Brand consideration
4. Brand preference
5. Preference reasoning
6. Brand distinctiveness
7. Relationship with Wynter
8. Brand associations (conditional)
9. Distinctive memory structures (conditional)

## Tech Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **AI SDK:** @anam-ai/js-sdk 4.1.0
- **Runtime:** Node.js 20+

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Anam AI API key from [lab.anam.ai](https://lab.anam.ai)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anam API key:

```env
ANAM_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Start a Survey Session

1. Click **"Start Session"** to initialize Sofia
2. Wait for the connection to establish (green status indicator)
3. Sofia will guide you through the 9-question brand tracking survey
4. Answer one question at a time naturally through voice
5. Survey takes approximately 5-7 minutes to complete

## Project Structure

```
anam-poc/
├── app/
│   ├── api/
│   │   └── anam-session/
│   │       └── route.ts          # Session token API endpoint
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page with Sofia
├── components/
│   └── SofiaVideo.tsx             # Sofia video component
├── config/
│   ├── anam.config.js             # JS configuration
│   └── anam.config.ts             # TypeScript configuration
├── lib/
│   ├── hooks/
│   │   └── useAnamClient.ts       # Anam client hook
│   └── types/
│       └── anam.ts                # TypeScript types
├── .env.local.example             # Environment template
└── ANAM_API_ANALYSIS.md           # API documentation
```

## Configuration

### Sofia Persona Settings

Sofia's configuration is defined in `config/anam.config.ts`:

```typescript
export const ANAM_PERSONA_CONFIG = {
  name: 'Sofia',
  avatarId: '6dbc1e47-7768-403e-878a-94d7fcc3677b',
  voiceId: '3e119786-d834-448f-96a2-20c1b5469eb4',
  llmId: '0934d97d-0c3a-4f33-91b0-5e136a0ef466',
  systemPrompt: '...' // Brand tracking survey interviewer script
};
```

### Survey Customization

To customize the survey questions or brands:
1. Edit the `systemPrompt` in `config/anam.config.ts`
2. Update the brand list in the survey flow
3. Modify question wording as needed
4. Add or remove questions (remember to update conditional logic)

## API Endpoints

### POST /api/anam-session

Generates a short-lived session token with embedded persona configuration for client-side SDK initialization.

**How it works:**
1. Server receives POST request
2. Server sends persona config to Anam API
3. Anam API returns session token with embedded config
4. Token is passed to client for `createClient()`

**Request:**
```bash
curl -X POST http://localhost:3000/api/anam-session
```

**Response:**
```json
{
  "sessionToken": "eyJ..."
}
```

**Note:** The session token contains Sofia's complete persona configuration (avatar, voice, LLM, system prompt). No client-side configuration is needed.

## Components

### `<SofiaVideo />`

Main video component for Sofia interaction.

**Features:**
- WebRTC video streaming
- Connection status indicator
- Error handling with overlay
- Session controls (start/stop)
- Optional message history display

**Usage:**
```tsx
import SofiaVideo from '@/components/SofiaVideo';

<SofiaVideo />
```

## Hooks

### `useAnamClient()`

Custom hook for managing Anam client lifecycle.

**Returns:**
```typescript
{
  client: AnamClient | null,
  status: AnamConnectionStatus,
  error: string | null,
  messageHistory: any[],
  initializeClient: () => Promise<AnamClient>,
  streamToVideo: (videoElementId: string) => Promise<void>,
  stopStreaming: () => void
}
```

## Development

### Running the Dev Server

```bash
npm run dev
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "Legacy session tokens are no longer supported"

This error occurs if using an outdated SDK version or API format. **Solution:**
- Ensure `@anam-ai/js-sdk` is version 4.0.0 or higher
- Verify persona config is sent in session token request (server-side)
- Client-side should only pass token to `createClient(sessionToken)`

### "ANAM_API_KEY is not configured"

Ensure `.env.local` exists and contains your API key:
```env
ANAM_API_KEY=your_key_here
```

Restart the development server after adding environment variables.

### Video not playing

- Check browser console for WebRTC errors
- Ensure microphone permissions are granted
- Verify you're using HTTPS in production (required for WebRTC)

### Connection fails immediately

- Verify API key is valid at [lab.anam.ai](https://lab.anam.ai)
- Check network connectivity
- Review server logs for session token errors
- Ensure persona config is properly formatted in API route

### TypeScript errors

Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile Safari (requires `playsinline` attribute)

## Security Considerations

- ✅ API key stored server-side only
- ✅ Session tokens are short-lived
- ✅ No sensitive data exposed client-side
- ⚠️ Implement rate limiting for production
- ⚠️ Set appropriate CORS policies
- ⚠️ Use HTTPS in production

## Performance

- WebRTC streaming requires stable network
- Recommended minimum: 1 Mbps upload/download
- Video quality adapts to network conditions
- Consider implementing reconnection logic for poor networks

## Resources

- 📚 [Anam AI Documentation](https://docs.anam.ai)
- 📦 [Anam AI SDK (npm)](https://www.npmjs.com/package/@anam-ai/js-sdk)
- 🔗 [GitHub SDK Repository](https://github.com/anam-org/javascript-sdk)
- 🎨 [Anam Lab (API Keys)](https://lab.anam.ai)
- 📖 [Full API Analysis](./ANAM_API_ANALYSIS.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Add `ANAM_API_KEY` to your Vercel environment variables before deploying.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This is a proof-of-concept project for Wynter integration with Anam AI.

## Support

For Anam AI support, visit [docs.anam.ai](https://docs.anam.ai)

---

**Built with ❤️ for Wynter**
