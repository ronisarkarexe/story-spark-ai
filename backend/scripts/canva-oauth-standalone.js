/**
 * Canva OAuth 2.0 with PKCE - Standalone Simulator Server
 * 
 * This is an independent, single-file Express server that simulates the complete
 * authorization flow for the Canva Connect API using Proof Key for Code Exchange (PKCE).
 * 
 * Features:
 *   - Local App Server: Simulates your application's client-side / backend code.
 *   - Local Canva Mock Authorization Server: Simulates Canva's OAuth Consent Portal and Token endpoint.
 *   - Works instantly without needing real Canva API keys or registering an account!
 * 
 * Dependencies:
 *   - express (for running the web server)
 * 
 * Node.js version 18+ is recommended (uses global fetch).
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================================
// CONFIGURATION (Using standard values for our local demo)
// ============================================================================
const CLIENT_ID = 'demo_client_id_12345';
const CLIENT_SECRET = 'demo_client_secret_67890';
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = 'design:content:read asset:write';

// Local storage for matching verifiers and codes
const sessionStore = new Map();
const authorizationCodeStore = new Map();

// ============================================================================
// PKCE HELPERS
// ============================================================================
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest().toString('base64url');
}

// ============================================================================
// 1. APP ROUTE: HOME PAGE
// ============================================================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Canva OAuth 2.0 PKCE Simulator</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Outfit', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgb(4, 8, 28) 0%, rgb(18, 22, 52) 90%);
          color: #ffffff;
          max-width: 800px;
          margin: 60px auto;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
        }
        h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #00c4cc 0%, #8b3dff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        p {
          color: #a0aec0;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .config-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 20px;
          margin: 25px 0;
        }
        .config-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .config-item:last-child { border: none; }
        .label { font-weight: 600; color: #8b3dff; }
        .val { font-family: monospace; color: #00c4cc; }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #8b3dff 0%, #7129df 100%);
          color: #ffffff;
          padding: 14px 28px;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: 30px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 61, 255, 0.4);
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 61, 255, 0.6);
        }
        .footer {
          margin-top: 40px;
          font-size: 0.85rem;
          color: #718096;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Canva Connect API OAuth 2.0 PKCE Simulator</h1>
      <p>Welcome! This simulation demonstrates how client applications securely authenticate with Canva using <strong>Proof Key for Code Exchange (PKCE)</strong>. It requires zero configuration and works completely locally.</p>
      
      <div class="config-card">
        <h3>Application Config</h3>
        <div class="config-item">
          <span class="label">Client ID</span>
          <span class="val">${CLIENT_ID}</span>
        </div>
        <div class="config-item">
          <span class="label">Redirect URI</span>
          <span class="val">${REDIRECT_URI}</span>
        </div>
        <div class="config-item">
          <span class="label">API Scopes</span>
          <span class="val">${SCOPES}</span>
        </div>
      </div>

      <a href="/login" class="btn">🔑 Connect with Canva Simulator</a>

      <div class="footer">
        Powered by Antigravity Standalone PKCE Flow Engine
      </div>
    </body>
    </html>
  `);
});

// ============================================================================
// 2. APP ROUTE: INITIATE OAUTH FLOW (LOGIN)
// ============================================================================
app.get('/login', (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  // Store codeVerifier securely on our App's session state
  sessionStore.set(state, { codeVerifier });

  // In a real application, we redirect to Canva's authorization URL.
  // Here, we redirect to our local *Mock Canva Authorization Server* endpoint!
  const mockCanvaAuthUrl = new URL(`http://localhost:${PORT}/mock-canva/authorize`);
  mockCanvaAuthUrl.searchParams.append('response_type', 'code');
  mockCanvaAuthUrl.searchParams.append('client_id', CLIENT_ID);
  mockCanvaAuthUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  mockCanvaAuthUrl.searchParams.append('scope', SCOPES);
  mockCanvaAuthUrl.searchParams.append('code_challenge', codeChallenge);
  mockCanvaAuthUrl.searchParams.append('code_challenge_method', 's256');
  mockCanvaAuthUrl.searchParams.append('state', state);

  res.redirect(mockCanvaAuthUrl.toString());
});

// ============================================================================
// 3. MOCK CANVA ROUTE: AUTHORIZATION CONSENT PORTAL
// ============================================================================
app.get('/mock-canva/authorize', (req, res) => {
  const { client_id, redirect_uri, scope, code_challenge, state } = req.query;

  // Render a beautiful consent page mimicking Canva's login portal
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Connect with Canva</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Outfit', sans-serif;
          background-color: #f6f7fb;
          color: #0e0f19;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .consent-box {
          background: #ffffff;
          width: 440px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e1e3ea;
          text-align: center;
        }
        .canva-logo {
          font-size: 2.2rem;
          font-weight: 800;
          color: #00c4cc;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .canva-logo span {
          background: linear-gradient(135deg, #8b3dff 0%, #00c4cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        h2 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: #0e0f19;
        }
        .scopes-list {
          text-align: left;
          background: #f6f7fb;
          padding: 15px 20px;
          border-radius: 10px;
          margin: 20px 0;
          border: 1px solid #e1e3ea;
        }
        .scope-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 0.95rem;
          color: #2c2d3f;
        }
        .scope-item:last-child { margin-bottom: 0; }
        .checkmark { color: #8b3dff; font-weight: bold; }
        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }
        .btn {
          flex: 1;
          padding: 12px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .btn-allow {
          background: #8b3dff;
          color: white;
        }
        .btn-allow:hover { background: #7129df; }
        .btn-cancel {
          background: #e1e3ea;
          color: #2c2d3f;
        }
        .btn-cancel:hover { background: #d2d4de; }
        .technical-info {
          margin-top: 20px;
          font-size: 0.75rem;
          color: #718096;
          text-align: left;
          border-top: 1px solid #e1e3ea;
          padding-top: 15px;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="consent-box">
        <div class="canva-logo">
          <span>Canva</span>
        </div>
        <h2>Allow Demo App to access your Canva Account?</h2>
        <p style="color: #646573; font-size: 0.95rem;">Demo App is requesting permissions to view and update files in your Canva account.</p>
        
        <div class="scopes-list">
          <div class="scope-item">
            <span class="checkmark">✓</span>
            <span>Read your designs (<code>design:content:read</code>)</span>
          </div>
          <div class="scope-item">
            <span class="checkmark">✓</span>
            <span>Upload and manage files (<code>asset:write</code>)</span>
          </div>
        </div>

        <form action="/mock-canva/approve" method="POST">
          <input type="hidden" name="redirect_uri" value="${redirect_uri}">
          <input type="hidden" name="code_challenge" value="${code_challenge}">
          <input type="hidden" name="state" value="${state}">
          
          <div class="btn-group">
            <button type="button" class="btn btn-cancel" onclick="window.location.href='/'">Cancel</button>
            <button type="submit" class="btn btn-allow">Authorize Access</button>
          </div>
        </form>

        <div class="technical-info">
          <strong>PKCE Details:</strong><br>
          • Code Challenge (S256): <code>${code_challenge}</code><br>
          • State token: <code>${state}</code>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ============================================================================
// 4. MOCK CANVA ROUTE: PROCESS CONSENT APPROVAL & GENERATE CODE
// ============================================================================
app.post('/mock-canva/approve', (req, res) => {
  const { redirect_uri, code_challenge, state } = req.body;

  // Generate a mock authorization code
  const authCode = 'mock_auth_code_' + crypto.randomBytes(16).toString('hex');

  // Store challenge alongside generated code to verify verifier later during exchange
  authorizationCodeStore.set(authCode, { code_challenge });

  // Redirect back to client app URI with the auth code
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.append('code', authCode);
  redirectUrl.searchParams.append('state', state);

  res.redirect(redirectUrl.toString());
});

// ============================================================================
// 5. APP ROUTE: CALLBACK RECEIVER & INITIATE CODE EXCHANGE
// ============================================================================
app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  // Retrieve verifier saved during step 2
  const session = sessionStore.get(state);
  if (!session) {
    return res.status(400).send('OAuth state verification failed. The request may have expired.');
  }

  const { codeVerifier } = session;
  sessionStore.delete(state); // Clean up state

  // Call mock Canva Token exchange endpoint (hosted locally on the same server)
  try {
    const exchangeResponse = await fetch(`http://localhost:${PORT}/mock-canva/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenData = await exchangeResponse.json();

    if (!exchangeResponse.ok) {
      return res.status(exchangeResponse.status).send(`Token Exchange Failed: ${tokenData.error}`);
    }

    // Success Screen
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Connection Successful</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at 10% 20%, rgb(4, 8, 28) 0%, rgb(18, 22, 52) 90%);
            color: #ffffff;
            max-width: 800px;
            margin: 60px auto;
            padding: 35px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
          }
          h1 {
            color: #00c4cc;
            font-size: 2.2rem;
            margin-bottom: 10px;
          }
          .badge {
            background: rgba(0, 196, 204, 0.15);
            color: #00c4cc;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
          }
          .box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .box-title {
            font-weight: 700;
            color: #8b3dff;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
          }
          pre {
            background: #0f111a;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            color: #a9ffb2;
            font-family: monospace;
            font-size: 0.95rem;
            margin: 0;
            border: 1px solid rgba(255,255,255,0.05);
          }
          .btn-reset {
            display: inline-block;
            background: linear-gradient(135deg, #00c4cc 0%, #00a4ab 100%);
            color: #ffffff;
            padding: 12px 24px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 25px;
            margin-top: 20px;
            box-shadow: 0 4px 15px rgba(0, 196, 204, 0.3);
          }
        </style>
      </head>
      <body>
        <h1>🎉 Auth Flow Succeeded!</h1>
        <div class="badge">PKCE Token Exchange Completed</div>
        <p>Your client server successfully verified the PKCE challenge code and retrieved the access token from the Mock Canva Auth endpoint.</p>

        <div class="box">
          <div class="box-title">Generated Access Token <span>Expires in 3600s</span></div>
          <pre>${tokenData.access_token}</pre>
        </div>

        <div class="box">
          <div class="box-title">Refresh Token (For generating new tokens offline)</div>
          <pre>${tokenData.refresh_token}</pre>
        </div>

        <div class="box">
          <div class="box-title">Full Token Endpoint JSON Response</div>
          <pre>${JSON.stringify(tokenData, null, 2)}</pre>
        </div>

        <a href="/" class="btn-reset">🔄 Reset & Run Again</a>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`Exchange execution error: ${err.message}`);
  }
});

// ============================================================================
// 6. MOCK CANVA ROUTE: TOKEN EXCHANGE ENDPOINT (VALIDATES PKCE)
// ============================================================================
app.post('/mock-canva/token', (req, res) => {
  const { grant_type, client_id, client_secret, code, code_verifier } = req.body;

  // 1. Verify Client ID and Client Secret
  if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Client authentication failed.' });
  }

  // 2. Verify authorization code is present and valid
  const authCodeSession = authorizationCodeStore.get(code);
  if (!authCodeSession) {
    return res.status(400).json({ error: 'invalid_grant', error_description: 'Authorization code is invalid or expired.' });
  }

  const { code_challenge } = authCodeSession;
  authorizationCodeStore.delete(code); // consume code

  // 3. PKCE Verification: Hash the received code_verifier and match with code_challenge
  const hashedVerifier = crypto.createHash('sha256').update(code_verifier).digest().toString('base64url');

  if (hashedVerifier !== code_challenge) {
    console.error(`[PKCE Error] Code verifier hash does not match challenge!`);
    console.error(`  Received Verifier: ${code_verifier}`);
    console.error(`  Computed Hash:     ${hashedVerifier}`);
    console.error(`  Expected Challenge: ${code_challenge}`);
    return res.status(400).json({ error: 'invalid_grant', error_description: 'PKCE verification failed: Code verifier does not match challenge.' });
  }

  console.log(`[Mock Canva] PKCE verification success! Issuing tokens.`);

  // 4. Generate mock tokens
  const accessToken = 'canva_access_token_' + crypto.randomBytes(32).toString('hex');
  const refreshToken = 'canva_refresh_token_' + crypto.randomBytes(32).toString('hex');

  res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
    scope: SCOPES
  });
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Canva OAuth PKCE Simulator running on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
