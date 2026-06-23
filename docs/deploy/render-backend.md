# Deploy backend to Render

## 1. Authenticate CLI

```powershell
& "C:\Users\z4admin\Desktop\Tools\render-cli\bin\cli_v2.20.0.exe" login
```

Or open the device URL shown in the terminal and click **Authorize CLI**.

## 2. Create service from blueprint

From repo root:

```powershell
cd C:\Users\z4admin\Desktop\acquire\convo-ai
& "C:\Users\z4admin\Desktop\Tools\render-cli\bin\cli_v2.20.0.exe" blueprint apply
```

## 3. Set secrets in Render Dashboard

For service `convo-ai-backend`, add:

- `GOOGLE_AI_STUDIO_KEY`
- `DEEPGRAM_API_KEY`
- `ELEVENLABS_API_KEY`
- `CORS_ORIGINS` = `https://web-delta-three-73.vercel.app,http://localhost:3000`

## 4. Connect Vercel

Copy the Render service URL (e.g. `https://convo-ai-backend.onrender.com`) and set on Vercel:

```env
BACKEND_API_URL=https://convo-ai-backend.onrender.com
```

Redeploy Vercel. Verify: `GET https://web-delta-three-73.vercel.app/api/health` → `"backend": true`.
