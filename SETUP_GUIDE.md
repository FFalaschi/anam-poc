# Wynter POC Setup Guide

Complete step-by-step guide to get Sofia running on your local machine.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Anam AI account created at [lab.anam.ai](https://lab.anam.ai)
- [ ] API key generated from Anam dashboard
- [ ] Modern browser (Chrome, Firefox, Safari, or Edge)
- [ ] Microphone access enabled

## Installation Steps

### 1. Verify Node.js Installation

```bash
node --version
# Should output: v20.x.x or higher
```

If Node.js is not installed, download from [nodejs.org](https://nodejs.org)

### 2. Navigate to Project Directory

```bash
cd /path/to/anam-poc
```

### 3. Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 300+ packages in 30s
```

### 4. Configure Environment

#### Option A: Copy Template
```bash
cp .env.local.example .env.local
```

#### Option B: Create Manually
Create a new file named `.env.local` in the project root:

```env
ANAM_API_KEY=your_api_key_here
```

⚠️ **Important:** Replace `your_api_key_here` with your actual Anam API key.

### 5. Get Your Anam API Key

1. Visit [lab.anam.ai](https://lab.anam.ai)
2. Sign in or create an account
3. Navigate to API Keys section
4. Generate new API key
5. Copy the key (you won't be able to see it again)
6. Paste into `.env.local`

### 6. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

### 7. Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

## Testing the Integration

### Step 1: Check Page Load

You should see:
- "Wynter AI Research Assistant" header
- Sofia video container with placeholder
- "Start Session" button
- Three feature cards
- Usage instructions box

### Step 2: Start Session

1. Click the **"Start Session"** button
2. Status indicator should change from gray (Disconnected) to yellow (Connecting)
3. Browser may prompt for microphone permission - click "Allow"
4. Status should turn green (Connected)
5. Sofia's video should start streaming

### Step 3: Test Interaction

1. Speak clearly into your microphone
2. Ask a simple question: "What is market sizing?"
3. Sofia should respond with her voice
4. Message history (if enabled) will show the conversation

### Step 4: End Session

1. Click the **"End Session"** button
2. Video stream should stop
3. Status should return to gray (Disconnected)

## Troubleshooting

### Issue: "Cannot find module '@anam-ai/js-sdk'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "ANAM_API_KEY is not configured"

**Solution:**
1. Verify `.env.local` exists in project root
2. Check API key is correctly formatted:
   ```env
   ANAM_API_KEY=sk_live_abc123xyz
   ```
3. Restart dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

### Issue: Video container shows error overlay

**Possible causes:**
1. **Invalid API key**
   - Regenerate key at lab.anam.ai
   - Update `.env.local`
   - Restart server

2. **Network connectivity**
   - Check internet connection
   - Verify firewall isn't blocking WebRTC
   - Try different network

3. **Browser incompatibility**
   - Update browser to latest version
   - Try different browser (Chrome recommended)

### Issue: No audio/video stream

**Solutions:**
1. **Check microphone permissions**
   - Browser settings → Permissions → Microphone
   - Enable for localhost:3000

2. **Verify WebRTC support**
   - Open browser console (F12)
   - Look for WebRTC errors
   - Ensure browser supports WebRTC

3. **HTTPS requirement**
   - In production, use HTTPS
   - Localhost works with HTTP for testing

### Issue: TypeScript errors

**Solution:**
```bash
npm install --save-dev @types/node @types/react @types/react-dom typescript
```

## Verification Checklist

After setup, verify these work:

- [ ] Page loads without console errors
- [ ] "Start Session" button is clickable
- [ ] Status indicator changes colors
- [ ] Microphone permission requested
- [ ] Video stream displays Sofia
- [ ] Audio plays from speakers
- [ ] "End Session" stops stream
- [ ] No error messages in console

## File Structure Verification

Ensure these files exist:

```
anam-poc/
├── .env.local                    ← Must exist and contain API key
├── app/
│   ├── api/anam-session/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── SofiaVideo.tsx
├── config/
│   ├── anam.config.js
│   └── anam.config.ts
├── lib/
│   ├── hooks/useAnamClient.ts
│   └── types/anam.ts
├── node_modules/                 ← Should exist after npm install
├── package.json
└── tsconfig.json
```

## Next Steps

Once setup is complete:

1. **Customize Sofia's Behavior**
   - Edit `config/anam.config.ts`
   - Modify `systemPrompt` field
   - Restart server to apply changes

2. **Enhance UI**
   - Modify `components/SofiaVideo.tsx`
   - Update styles in `app/page.tsx`
   - Add custom features

3. **Production Deployment**
   - Follow [README.md](./README.md) deployment section
   - Add environment variables to hosting platform
   - Enable HTTPS

## Getting Help

### Console Logs

Check browser console (F12) for detailed logs:
- ✅ "Connected to Sofia" = Success
- ❌ "Failed to initialize" = Check API key
- 📝 "Message history updated" = Conversation working

### Server Logs

Terminal shows server-side errors:
- API key validation issues
- Session token generation errors
- Network problems

### Support Resources

- **Anam Documentation:** [docs.anam.ai](https://docs.anam.ai)
- **Project README:** [README.md](./README.md)
- **API Analysis:** [ANAM_API_ANALYSIS.md](./ANAM_API_ANALYSIS.md)
- **GitHub SDK:** [github.com/anam-org/javascript-sdk](https://github.com/anam-org/javascript-sdk)

## Common Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANAM_API_KEY` | Yes | Anam AI API key from lab.anam.ai | `sk_live_abc123...` |

## Success Indicators

Your setup is complete when:

1. ✅ Dev server runs without errors
2. ✅ Page loads at localhost:3000
3. ✅ No TypeScript errors
4. ✅ API route responds at /api/anam-session
5. ✅ Video stream connects successfully
6. ✅ Sofia responds to voice input
7. ✅ No console errors or warnings

---

**Setup Complete!** 🎉 You're ready to interact with Sofia.

For detailed usage instructions, see [README.md](./README.md)
