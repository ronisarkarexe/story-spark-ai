# Standalone Canva OAuth 2.0 PKCE Simulator

This is an independent, single-file Express server that simulates the complete authentication flow for the Canva Connect API using Proof Key for Code Exchange (PKCE). 

**It does not require any Canva Developer Account, Client IDs, or Secrets. It runs completely offline and local!**

## How it works
- **App Home Page**: Simulates your custom application's landing page.
- **Canva Authorization Portal**: Simulates Canva's actual login consent portal where permissions are granted.
- **Canva Token Exchange**: Simulates Canva's OAuth endpoint, verifying the PKCE `code_verifier` hash against the original `code_challenge` before issuing tokens.

## Prerequisites
- Node.js 18 or higher (uses built-in `fetch` API)

## Setup & Running

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Run the simulator**:
   ```bash
   node scripts/canva-oauth-standalone.js
   ```

3. **Complete the flow**:
   * Open [http://localhost:3000](http://localhost:3000) in your web browser.
   * Click **Connect with Canva Simulator**.
   * On the mock Canva Consent Portal, click **Authorize Access**.
   * It will automatically return you to the callback page, complete the PKCE token exchange, and print the generated access and refresh tokens!
