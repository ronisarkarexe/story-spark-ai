# Contributing to StorySparkAI

Thank you for your interest in contributing to **StorySparkAI**! We welcome contributions from developers of all skill levels. This guide will help you understand our monorepo structure, set up your local development environment, follow our git workflow, and submit high-quality Pull Requests.

---

## Table of Contents

- [About StorySparkAI](#about-storysparkai)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [1. Fork and Clone the Repository](#1-fork-and-clone-the-repository)
- [2. Installing Dependencies](#2-installing-dependencies)
- [3. Environment Variable Setup](#3-environment-variable-setup)
  - [Frontend Environment (.env)](#frontend-environment-env)
  - [Backend Environment (.env)](#backend-environment-env)
- [4. Running the Project Locally](#4-running-the-project-locally)
  - [Option A: Running Both Services Simultaneously (Recommended)](#option-a-running-both-services-simultaneously-recommended)
  - [Option B: Running Frontend and Backend Separately](#option-b-running-frontend-and-backend-separately)
- [5. Building and Testing](#5-building-and-testing)
- [6. Contribution Workflow](#6-contribution-workflow)
  - [Step 1: Get Assigned to an Issue](#step-1-get-assigned-to-an-issue)
  - [Step 2: Sync main and Create a Feature Branch](#step-2-sync-main-and-create-a-feature-branch)
  - [Step 3: Commit Message Format (Conventional Commits)](#step-3-commit-message-format-conventional-commits)
  - [Step 4: Submitting a Pull Request](#step-4-submitting-a-pull-request)
- [7. Updating the Changelog](#7-updating-the-changelog)
- [8. Common Troubleshooting](#8-common-troubleshooting)
- [9. Frequently Asked Questions (FAQ)](#9-frequently-asked-questions-faq)
- [10. Code of Conduct & Support](#10-code-of-conduct--support)

---

## About StorySparkAI

StorySparkAI is an AI-powered storytelling platform designed to assist creators, writers, and storytellers. Built with modern web technologies, it features an interactive frontend interface and a robust backend API supporting multiple AI model integrations (OpenAI, Google Gemini, Anthropic), real-time collaboration via WebSockets, character consistency tools, and automated story analysis.

---

## Monorepo Structure

StorySparkAI is structured as a **monorepo** organized into workspace directories:

```text
story-spark-ai/
├── frontend/               # React 19 + Vite + TypeScript application (UI)
│   ├── src/                # Components, Redux slices, services, utils, hooks
│   ├── package.json        # Frontend dependencies & scripts (story-spark-ai-frontend)
│   └── .env.example        # Environment variable template for frontend
├── backend/                # Express.js + Node.js + TypeScript API server
│   ├── src/                # Controllers, models, routes, middleware, services
│   ├── scripts/            # Database seed scripts and backend utilities
│   ├── package.json        # Backend dependencies & scripts (story-spark-ai-backend)
│   └── .env.example        # Environment variable template for backend
├── .github/                # GitHub Issue & PR templates, workflows
├── package.json            # Root workspace config & workspace scripts
├── pnpm-workspace.yaml     # PNPM workspace definition
├── docker-compose.yml      # Containerized local setup config
└── README.md               # Main project overview
```

---

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

| Tool | Required Version | Download / Reference |
|------|------------------|----------------------|
| **Node.js** | `v20.x` (LTS recommended) | [nodejs.org](https://nodejs.org) |
| **Package Manager** | `pnpm v9.15.9` (recommended) or `npm v9+` | [pnpm.io](https://pnpm.io) |
| **MongoDB** | Community Server (Local) or MongoDB Atlas | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest version | [git-scm.com](https://git-scm.com) |

> 💡 **Tip:** We recommend using a Node version manager such as **nvm** (macOS/Linux) or **nvm-windows** / **Volta** (cross-platform) to manage Node versions easily.

Verify your installed versions:

```bash
node -v
pnpm -v # or npm -v
git --version
```

---

## 1. Fork and Clone the Repository

1. **Fork** the repository on GitHub by clicking the **Fork** button at the top right of [ronisarkarexe/story-spark-ai](https://github.com/ronisarkarexe/story-spark-ai).
2. **Clone** your forked repository to your local machine:

```bash
git clone https://github.com/<your-github-username>/story-spark-ai.git
cd story-spark-ai
```

3. Configure the **upstream** remote to track the original repository:

```bash
git remote add upstream https://github.com/ronisarkarexe/story-spark-ai.git
git remote -v
```

---

## 2. Installing Dependencies

This project uses workspaces. You can install all dependencies for both `frontend` and `backend` with a single command at the root directory:

### Workspace Install (Recommended)

```bash
# Using PNPM (Recommended)
pnpm install

# Or using NPM
npm install
```

### Installing Frontend & Backend Dependencies Separately

If you prefer installing dependencies for each project individually:

**Frontend Dependencies:**
```bash
cd frontend
pnpm install # or npm install
cd ..
```

**Backend Dependencies:**
```bash
cd backend
pnpm install # or npm install
cd ..
```

---

## 3. Environment Variable Setup

Both the frontend and backend require `.env` configuration files. Template files (`.env.example`) are provided in both directories.

### Creating the `.env` files

**On macOS / Linux (Bash):**
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

**On Windows (PowerShell):**
```powershell
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

---

### Frontend Environment (`frontend/.env`)

Configure `frontend/.env` with the following variables:

```env
# Backend API Base URL
VITE_BASE_URL=http://localhost:5000/api/v1

# Real-time WebSocket Server URL
VITE_SOCKET_URL=http://localhost:5000

# Maximum token context for story AI components
VITE_MAX_CONTEXT_TOKENS=4096

# Google OAuth Client ID (Optional for local social login testing)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

### Backend Environment (`backend/.env`)

Configure `backend/.env` with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:4001,http://localhost:5173

# Database Connection (MongoDB local instance or Atlas URI)
DATABASE_URL=mongodb://127.0.0.1:27017/story_spark_ai

# Authentication Secrets & Settings
SALT_ROUNDS=10
JWT_SECRET=your_local_jwt_secret_key_here
JWT_REFRESH_SECRET=your_local_refresh_token_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=120d
DEFAULT_ADMIN_PASSWORD=admin_password_123
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_secure_password

# AI Provider Keys (At least one key is recommended for AI generation features)
OPEN_AI_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Image Generation Options ('openai' or 'google')
IMAGE_GENERATION_PROVIDER=openai
IMAGE_GENERATION_API_KEY=your_image_gen_api_key
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002

# Payment & Social OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AI Key Rotation & Rate Limiting
AI_API_KEYS=your_key_1,your_key_2
AI_CONCURRENCY=3
MAX_CONTEXT_TOKENS=4096
```

> ⚠️ **Security Warning:** Never commit `.env` files or expose actual production API keys to git repositories. All `.env` files are ignored via `.gitignore`.

---

## 4. Running the Project Locally

Ensure your local MongoDB service is running before starting the backend server.

### Option A: Running Both Services Simultaneously (Recommended)

From the project root directory, run:

```bash
# Using PNPM
pnpm dev

# Or using NPM
npm run dev
```

This starts both the **Express Backend** (on `http://localhost:5000`) and the **Vite Frontend** (on `http://localhost:4001` or `http://localhost:5173`) concurrently in a single terminal.

---

### Option B: Running Frontend and Backend Separately

You can run each service in a separate terminal window:

**Terminal 1 — Backend:**
```bash
# From repository root
pnpm dev:backend   # or npm run dev:backend

# Or navigate to backend directory
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
# From repository root
pnpm dev:frontend  # or npm run dev:frontend

# Or navigate to frontend directory
cd frontend
npm run dev
```

Once started:
- Access the **Frontend UI**: `http://localhost:4001` or `http://localhost:5173`
- Access the **Backend API**: `http://localhost:5000/api/v1`

---

## 5. Building and Testing

Before submitting your contribution, ensure your code compiles without TypeScript errors and passes all tests.

### TypeScript Type Checking

Run workspace-wide type checks:

```bash
npm run typecheck
```

Or typecheck individual projects:
- Frontend: `npm run typecheck -w story-spark-ai-frontend` (or `cd frontend && npm run typecheck`)
- Backend: `npm run typecheck -w story-spark-ai-backend` (or `cd backend && npm run typecheck`)

### Running Tests

Run all unit tests across frontend and backend:

```bash
npm run test
```

Or test individually:
- **Backend Tests (Jest):** `cd backend && npm test`
- **Frontend Tests (Vitest):** `cd frontend && npm test`

### Production Build

Verify that both frontend and backend build cleanly:

```bash
npm run build
```

---

## 6. Contribution Workflow

To maintain code quality and project consistency, please follow this step-by-step contribution workflow.

### Step 1: Get Assigned to an Issue

1. Browse open issues on the [StorySparkAI Issue Tracker](https://github.com/ronisarkarexe/story-spark-ai/issues).
2. Comment on an issue you'd like to work on and wait for a project maintainer to assign it to you.
3. **Do not create pull requests for unassigned issues** to avoid duplicate work.

---

### Step 2: Sync `main` and Create a Feature Branch

Always branch off the latest `main` branch:

```bash
# Fetch latest changes from upstream
git checkout main
git pull upstream main

# Create a new descriptive branch
git checkout -b <type>/<short-description>
```

#### Branch Naming Conventions

Use the following prefixes when naming your branch:

| Prefix | Usage / Purpose | Example Branch Name |
|--------|-----------------|---------------------|
| `feat/` | New features or functionality | `feat/character-consistency-checker` |
| `fix/` | Bug fixes and corrections | `fix/jwt-auth-middleware-expiry` |
| `docs/` | Documentation improvements | `docs/improve-contributing-guide` |
| `refactor/` | Code refactoring (no functional changes) | `refactor/story-workspace-state` |
| `style/` | Formatting, CSS adjustments, UI tweaks | `style/fix-input-padding` |
| `test/` | Adding or updating tests | `test/character-portrait-controller` |
| `chore/` | Maintenance tasks, dependency updates | `chore/update-dependencies` |

---

### Step 3: Commit Message Format (Conventional Commits)

StorySparkAI enforces the **Conventional Commits** specification. Commit messages must be structured as follows:

```text
<type>(<scope>): <short description>
```

#### Message Components:
1. **`type`** (Required): Must be one of:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of code (white-space, formatting, etc.)
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `perf`: A code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `chore`: Changes to build process, tooling, or helper dependencies
2. **`scope`** (Optional): Component or layer affected (e.g., `frontend`, `backend`, `auth`, `ui`, `story`, `deps`).
3. **`description`** (Required): Short summary of the change in imperative, present tense (e.g., "add", not "added").

#### Examples of Good Commit Messages:

```bash
git commit -m "feat(auth): implement Google OAuth authentication flow"
git commit -m "fix(backend): resolve MongoDB connection timeout on startup"
git commit -m "docs(contributing): add setup guide and commit conventions"
git commit -m "refactor(frontend): simplify story timeline visualization component"
git commit -m "test(backend): add unit tests for character portrait endpoint"
```

---

### Step 4: Submitting a Pull Request

1. Push your feature branch to your GitHub fork:

```bash
git push origin <type>/<short-description>
```

2. Navigate to [ronisarkarexe/story-spark-ai](https://github.com/ronisarkarexe/story-spark-ai) and click **New Pull Request**.
3. Fill out the [Pull Request Template](.github/pull_request_template.md) completely:
   - **Related Issue:** Link the issue using GitHub keywords (e.g., `Closes #4258` or `Fixes #123`).
   - **Type of Change:** Select all applicable checkboxes (Bug fix, New feature, Refactor, Documentation).
   - **What this PR does:** Provide a concise summary of your changes.
   - **Screenshots / Proof:** Attach screenshots or a video recording for UI changes (or note `N/A` with a reason for backend/documentation PRs).
   - **Checklist:** Confirm you have run tests, performed a self-review, and verified code standards.

---

## 7. Updating the Changelog

When submitting a Pull Request that introduces user-facing changes, bug fixes, or notable enhancements, please update `CHANGELOG.md`:

Add your entry under the `[Unreleased]` header under the appropriate sub-category:
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

---

## 8. Common Troubleshooting

### `pnpm install` or `npm install` fails
- Ensure you are running Node.js version `v20.x` (`node -v`).
- Clear cache and reinstall:
  ```bash
  rm -rf node_modules frontend/node_modules backend/node_modules
  pnpm install # or npm install
  ```

### Port already in use (`5000`, `4001`, or `5173`)
- Kill the process listening on the port:
  ```bash
  # Windows PowerShell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

  # Linux / macOS
  npx kill-port 5000 4001 5173
  ```

### Environment variables not loading
- Verify `.env` files exist in both `frontend/` and `backend/` directories (copied from `.env.example`).
- Restart the development servers after changing any `.env` file.

### MongoDB Connection Errors
- Check that your MongoDB server is active (`mongod` or local MongoDB Windows Service).
- Verify `DATABASE_URL` in `backend/.env` points to a valid MongoDB URI.

---

## 9. Frequently Asked Questions (FAQ)

1. **Do I need to be assigned to an issue before working on it?**
   - Yes. Please wait until a maintainer assigns the issue to you before starting work. Contributions made without assignment may be closed to prevent duplicate effort.

2. **My PR has merge conflicts. How do I resolve them?**
   - Sync your local `main` branch with `upstream/main`, rebase or merge `main` into your feature branch, resolve conflicts locally, run tests, and push the updated branch.

3. **Can I push directly to the `main` branch?**
   - No. All changes must be submitted via Pull Requests from a feature branch on a fork.

4. **How long does PR review take?**
   - Maintainers review PRs as quickly as possible. Please allow a few days for review.

---

## 10. Code of Conduct & Support

- **Code of Conduct:** Please read and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).
- **Need Help?** If you have questions or get stuck, feel free to ask in [GitHub Discussions](https://github.com/ronisarkarexe/story-spark-ai/discussions) or comment directly on the issue you are assigned to.

---

### 💗 Thank you for contributing to StorySparkAI!
