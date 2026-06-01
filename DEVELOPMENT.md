Development — Local setup and onboarding
======================================

Purpose
-------
This document provides a concise, step-by-step guide to set up, run, and test the project locally. It is intended for contributors preparing a development environment and does not replace higher-level documentation such as `README.md`, `CONTRIBUTING.md`, or `ARCHITECTURE.md`.

Prerequisites
-------------
- Node.js 20.x (recommended)
- npm 9+ or pnpm 9+
- Python 3.10+ (required only to run the optional ML demo)

Use a version manager (for example `nvm` or `volta`) to manage Node.js versions.

Quick start
-----------
1. Clone the repository and install workspace dependencies:

```bash
# Replace <REPO_URL> with the repository origin
git clone <REPO_URL>
cd story-spark-ai
npm install
```

2. Start the frontend in one terminal:

```bash
cd frontend
npm run dev
```

3. Start the backend in another terminal:

```bash
cd backend
npm run dev
```

Follow the output of each command for service URLs and status messages.

Project structure
-----------------

- `frontend/` — React + Vite application (UI)
- `backend/` — Express API, services, and ML helpers
- `ARCHITECTURE.md` — architecture and design documentation

Environment variables
---------------------
Copy example environment files and populate required values.

Example (macOS / Linux):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Example (PowerShell):

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Typical development placeholders:

- `MONGODB_URI` (e.g. `mongodb://localhost:27017/storyspark-dev`)
- `JWT_SECRET` (a random string for local development)
- `OPENAI_API_KEY` or `GOOGLE_GEMINI_KEY` (if available)

If API keys are not provided, features that depend on external services will not function; core frontend and backend functionality can still be exercised.

Frontend — run dev server
-------------------------

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (commonly `http://localhost:5173`).

Backend — run dev server
------------------------

```bash
cd backend
npm run dev
```

Check `backend/package.json` for exact script names (for example `dev`, `start`, or `build`).

Tests and linters
-----------------

Run backend tests:

```bash
cd backend
npm test
```

Run Python/ML tests (if present). From the repository root run:

```bash
pytest backend/ml/tests
```
Or, if you prefer to change directory first:

```bash
cd backend
pytest ml/tests
```

Run linters and formatters as defined in project manifests (for example `npm run lint`).

Convenience: start both services
--------------------------------
If you frequently run both services together, you may add a local `dev:all` script to the root `package.json`. Example:

Add the following `dev:all` script to your root `package.json` (inside the existing `scripts` section). Example full object shown below:

```json
{
  "scripts": {
    "dev:all": "concurrently \"cd frontend && npm run dev\" \"cd backend && npm run dev\""
  }
}
```

Install `concurrently` as a development dependency if this pattern is used.

Common troubleshooting
----------------------

- Streamlit `FileNotFoundError`: verify that required ML artifacts are available under the configured artifacts directory (for example `backend/ml/saved/`).
- Rate limiting during local testing: review rate-limiter middleware in `backend/src/app/middleware` and adjust settings for development if necessary.
- Seeding an admin user: review and run the seed script in `backend/scripts/seed-admin.ts` if needed.
- Windows path issues: use PowerShell examples above or WSL when applicable.

Contributing notes
------------------

- Follow the project's `CONTRIBUTING.md` for PR conventions and code style.
- Keep changes focused and incremental; open an issue for larger proposals before implementing.
- When adding environment variables, update `backend/.env.example` and this document accordingly.

References
----------

- Project overview: `README.md`
- Contribution guidelines: `CONTRIBUTING.md`
- Architecture: `ARCHITECTURE.md`

