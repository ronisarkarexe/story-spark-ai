<div align="center">
<h1>👩‍💻 StorySparkAI</h1>
<p>An open-source platform designed for creative minds to generate and share multiple story variations from a single prompt. Perfect for writers, creators, and enthusiasts exploring AI-powered storytelling!</p>
</div>

<p align="center">
   <a href="https://github.com/ronisarkarexe/story-spark-ai/blob/master/LICENSE" target="blank">
   <img src="https://img.shields.io/github/license/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="License" />
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/fork" target="blank">
   <img src="https://img.shields.io/github/forks/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Forks"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/stargazers" target="blank">
   <img src="https://img.shields.io/github/stars/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Stars"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/issues" target="blank">
   <img src="https://img.shields.io/github/issues/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Issues"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/pulls" target="blank">
   <img src="https://img.shields.io/github/issues-pr/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Pull Requests"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/actions/workflows/ci.yml" target="blank">
   <img src="https://github.com/ronisarkarexe/story-spark-ai/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"/>
   </a>
</p>

---

## 📚 Table of Contents
- [About 🚀](#about-)
- [Features 💪](#features-)
- [Feature Documentation 📄](#feature-documentation-)
- [Known Behavior & UX Notes](#known-behavior--ux-notes-)
- [Local Development](#local-development-monorepo)
- [Environment Variables](#environment-variables)
- [Minimal Working Example (Story Generation API)](#minimal-working-example-story-generation-api)
- [API Reference 📡](#api-reference-)
- [Troubleshooting 🛠️](#troubleshooting-️)
- [Contributing 👨‍💻](#contributing-)
- [Contributors 🤝](#contributors-)
- [Maintainers](#maintainers)
- [License 📜](#license-)
- [Support 🙏](#support-)

---

## 🧭 Quick Navigation

Jump straight to the most commonly needed setup and deployment sections:

- [Local Development](#local-development-monorepo)
- [Environment Variables](#environment-variables)
- [Deployment (Vercel)](#deploying-on-vercel)
- [Troubleshooting](#troubleshooting-️)

---

## About 🚀

- Website: [StorySparkAI](https://storysparkai.vercel.app/)
- **StorySparkAI** empowers creative minds by generating and showcasing AI-crafted stories from user prompts in a simple, engaging way.
- Users can:
  - Input an idea or prompt
  - Explore multiple story variations
  - Save favorites
  - Leverage AI analysis to enhance their creative writing journey

---

## Features 💪

- **AI-Powered Story Generation**: Create unique stories instantly using advanced AI models.
- **Prompt-Based Storytelling**: Provide a prompt and watch it come to life.
- **AI Prompt Enhancement & Creativity Score System**: Automatically refines user prompts and scores generated stories for creativity — see [Feature Documentation](#feature-documentation-) for details.
- **Story Comparison & Diff Visualization**: Compare story variations side-by-side and see exactly how they differ — see [Feature Documentation](#feature-documentation-) for details.
- **Story Bookmarks & History**: Save and revisit your favorite creations.
- **AI Analysis**: Get summaries, critiques, and insights on your stories.
- **Creative Writing Assistance**: Overcome writer's block with intelligent suggestions.
- **Responsive UI**: Seamless experience across devices.
- **Dark Mode**: Toggle between light and dark themes for a comfortable reading experience.
- **Google Login**: Sign in quickly and securely using your Google account.
- **User Reviews**: Share your experience and explore reviews from the community.
- **Subscription Plans**: Access unlimited story generation and team collaboration with paid plans.
- **Featured Posts**: Discover featured posts curated from the community.

---

## Feature Documentation 📄

Some features have dedicated, deeper-dive documentation beyond this README. Start here if you want implementation details, checklists, or a quick-start for a specific system:

| Feature | Docs |
|---------|------|
| AI Prompt Enhancement & Creativity Score System | [AI_PROMPT_ENHANCEMENT_COMPLETE.md](./AI_PROMPT_ENHANCEMENT_COMPLETE.md) · [QUICK_START.md](./QUICK_START.md) · [FEATURE_IMPLEMENTATION_CHECKLIST.md](./FEATURE_IMPLEMENTATION_CHECKLIST.md) · [FILE_MANIFEST.md](./FILE_MANIFEST.md) |
| Story Comparison & Diff Visualization | [STORY_COMPARISON_IMPLEMENTATION.md](./STORY_COMPARISON_IMPLEMENTATION.md) · [COMPARISON_QUICK_REFERENCE.md](./COMPARISON_QUICK_REFERENCE.md) |
| System Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Local Setup & Onboarding | [DEVELOPMENT.md](./DEVELOPMENT.md) · [SETUP.md](./SETUP.md) |
| Password Visibility & Accessibility | [PASSWORD_VISIBILITY_ACCESSIBILITY.md](./PASSWORD_VISIBILITY_ACCESSIBILITY.md) · [PASSWORD_VISIBILITY_CODE_REFERENCE.md](./PASSWORD_VISIBILITY_CODE_REFERENCE.md) |
| Security Policy | [SECURITY.md](./SECURITY.md) |
| Version History | [CHANGELOG.md](./CHANGELOG.md) |

> 💡 If you add a new standalone doc file to the repo root, please add a row here so it stays discoverable.

---

## Known Behavior & UX Notes 📋

### Issue [#4238](https://github.com/ronisarkarexe/story-spark-ai/issues/4238) — Loading State During Story Generation

**Current behavior:** Clicking "Generate Story" multiple times while waiting for AI output creates duplicate requests, wastes API credits, and leaves users uncertain whether the app is working.

**Recommended fix for contributors:**

Disable the Generate button and show a loading spinner while a request is in flight. Here is a minimal React example:

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleGenerate = async () => {
  if (isLoading) return;           // guard against duplicate clicks
  setIsLoading(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/story/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setStories(data.stories);
  } finally {
    setIsLoading(false);           // always re-enable the button
  }
};

// In JSX:
<button onClick={handleGenerate} disabled={isLoading}>
  {isLoading ? "Generating…" : "Generate Story"}
</button>
```

**Why this matters:**
- Prevents duplicate API calls that increase operational costs.
- Gives users clear feedback that the app is working, especially on slow connections.
- Generated stories are held in component state; a browser refresh clears them — consider persisting results to `localStorage` or the backend history endpoint as a follow-up improvement.

**Status:** Open — contributions welcome! See [Contributing](#contributing-) to get started.

---

## Local Development (Monorepo)

**Prerequisites:** Node.js **18.18+**, pnpm **8+**, MongoDB URI for the API.

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-github-username>/story-spark-ai.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd story-spark-ai
   ```

3. **Install dependencies** (single install at the repo root — pnpm workspaces)
   ```bash
   pnpm install
   ```

4. **Environment files**
   - Copy `backend/.env.example` → `backend/.env` and fill in all values (see [Environment Variables](#environment-variables)).
   - Copy `frontend/.env.example` → `frontend/.env` and set `VITE_BASE_URL` to your API base URL (e.g., `http://localhost:5000/api/v1`). Optionally set `VITE_SOCKET_URL` for real-time notifications.

   > Never commit `backend/.env` or `frontend/.env`. Only `.env.example` files belong in git.

5. **First-Time Setup (Admin Seeding)**

   Before starting the server for the first time, create an admin user:
   ```bash
   cd backend
   npx ts-node scripts/seed-admin.ts
   ```
   Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `backend/.env`.

6. **Run apps**
   ```bash
   pnpm dev                  # Both frontend & backend
   pnpm dev:backend          # API only (default port 5000)
   pnpm dev:frontend         # Vite dev server on http://localhost:4001
   ```

7. **Production builds**
   ```bash
   pnpm run build
   pnpm run start:backend    # requires build:backend first
   pnpm run start:frontend   # serves built static app
   ```

### Deploying on Vercel

Use **two** Vercel projects from this monorepo:

| Project | Root directory | Example domain |
|---------|----------------|----------------|
| Frontend | `frontend` | `storysparkai.vercel.app` |
| Backend API | `backend` | `apistorysparkai.vercel.app` |

**Frontend environment variables:**
- `VITE_BASE_URL` = `https://<your-api>.vercel.app/api/v1`
- `VITE_SOCKET_URL` = `https://notification-socket-io.onrender.com` (do **not** point this at your Vercel API URL — Vercel serverless cannot run Socket.IO)

**Backend environment variables:** set `DATABASE_URL`, JWT secrets, AI keys, and `CORS_ORIGINS` including `https://storysparkai.vercel.app`.

---

## Environment Variables

After cloning, create your env files from the examples:

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

### Backend (`backend/.env`)

#### 🖥️ Server Configuration
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `development` | ✅ Yes | Environment mode |
| `PORT` | `5000` | ✅ Yes | Backend server port |
| `FRONTEND_URL` | `https://storysparkai.vercel.app` | ⚠️ Optional | Primary frontend URL (used in production for CORS/WebSockets) |
| `CORS_ORIGINS` | `http://localhost:4001` | ✅ Yes | Allowed frontend origin |

#### 🗄️ Database
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | `mongodb://127.0.0.1:27017/story_spark_ai` | ✅ Yes | MongoDB connection string |

#### 🔐 Authentication
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `SALT_ROUNDS` | `10` | ✅ Yes | bcrypt hashing rounds |
| `JWT_SECRET` | `any_random_string` | ✅ Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | `another_random_string` | ✅ Yes | Refresh token signing secret |
| `JWT_EXPIRES_IN` | `60d` | ✅ Yes | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | `120d` | ✅ Yes | Refresh token expiry |
| `ADMIN_EMAIL` | `admin@example.com` | ✅ Yes | Admin account email |
| `ADMIN_PASSWORD` | `secure-password` | ✅ Yes | Admin account password |
| `DEFAULT_ADMIN_PASSWORD` | `admin123` | ✅ Yes | Initial admin password for seeding |

#### 🤖 AI Providers
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `OPEN_AI_KEY` | `sk-...` | ⚠️ Optional | Required for OpenAI story generation |
| `GEMINI_API_KEY` | `AIza...` | ⚠️ Optional | Required for Gemini story generation |
| `AI_API_KEYS` | `key1,key2,key3` | ⚠️ Optional | Comma-separated keys for round-robin rotation |
| `AI_CONCURRENCY` | `3` | ⚠️ Optional | Max simultaneous AI calls (default: 3) |

> ℹ️ You need **at least one** of `OPEN_AI_KEY`, `GEMINI_API_KEY`, or `AI_API_KEYS` for story generation to work.

#### 🖼️ Image Provider (Unsplash)
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `UNSPLASH_KEY_API` | `your_access_key` | ⚠️ Optional | Required for story cover images |
| `UNSPLASH_KEY_API_SECRET` | `your_secret` | ⚠️ Optional | Unsplash API secret |

#### 📧 Email Verification
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VERIFY_EMAIL` | `noreply@example.com` | ⚠️ Optional | Sender email for verification emails |
| `VERIFY_PASSWORD` | `app_password` | ⚠️ Optional | Email app password |

#### 🔑 Google OAuth
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ⚠️ Optional | Required for Google Login |

### Frontend (`frontend/.env`)
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VITE_BASE_URL` | `http://localhost:5000/api/v1` | ✅ Yes | Backend API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | ⚠️ Optional | WebSocket server URL |
| `VITE_GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ✅ Yes | Google OAuth Client ID |

### ⚡ Minimum Setup for Local Development

**`backend/.env`**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=https://storysparkai.vercel.app
CORS_ORIGINS=http://localhost:4001
DATABASE_URL=mongodb://127.0.0.1:27017/story_spark_ai
SALT_ROUNDS=10
JWT_SECRET=any_random_string
JWT_REFRESH_SECRET=another_random_string
JWT_EXPIRES_IN=60d
JWT_REFRESH_EXPIRES_IN=120d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_PASSWORD=admin123
```

**`frontend/.env`**
```env
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🧪 Minimal Working Example (Story Generation API)

Once your backend is running and you have a valid auth token:

```bash
curl -X POST http://localhost:5000/api/v1/story/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{"prompt": "A lost astronaut discovers a planet made of memories"}'
```

**Example response:**
```json
{
  "success": true,
  "storyId": "64fabc1234...",
  "stories": [
    { "title": "Echoes of Memory", "content": "Far beyond the Orion belt...", "variation": 1 },
    { "title": "The Memory Planet", "content": "In the silence of space...", "variation": 2 }
  ]
}
```

> ⚠️ **Note (Issue #4238):** The API does not deduplicate in-flight requests. If a user clicks Generate multiple times before a response arrives, each click triggers a separate AI call. Implement a loading/disabled state in your UI to prevent this — see [Known Behavior & UX Notes](#known-behavior--ux-notes-).

---

## 📡 API Reference

The backend exposes RESTful API endpoints under the `/api` prefix. Below is a summary of the available endpoints.

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/auth/register` | Register a new user account | No |
| POST | `/api/auth/login` | Login and receive access/refresh tokens | No |
| POST | `/api/auth/refresh` | Refresh an expired access token | No |
| POST | `/api/auth/logout` | Invalidate the current session | Yes |
| POST | `/api/otp_validation/verify` | Verify email with OTP code | No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| GET | `/api/user/profile` | Get current user profile | Yes |
| PATCH | `/api/user/profile` | Update user profile | Yes |
| GET | `/api/users/:id` | Get a user's public profile | No |

### Stories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/stories/generate` | Generate a story from a prompt | Yes |
| GET | `/api/stories` | List stories (with pagination) | No |
| GET | `/api/stories/:id` | Get a single story | No |
| PATCH | `/api/stories/:id` | Update a story | Yes |
| DELETE | `/api/stories/:id` | Delete a story | Yes |

### AI Features
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/ai_model/generate` | Generate story with AI model | Yes |
| POST | `/api/analysis` | Analyze a story (summary, critique) | Yes |
| POST | `/api/ai-editor/suggest` | Get AI editing suggestions | Yes |
| POST | `/api/prompt-analysis` | Analyze and enhance a prompt | Yes |

### Social Features
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| GET | `/api/post` | List community posts | No |
| POST | `/api/post` | Create a new post | Yes |
| POST | `/api/review` | Submit a review | Yes |
| GET | `/api/review` | List reviews | No |
| POST | `/api/comment` | Add a comment | Yes |
| POST | `/api/reaction` | React to a story/post | Yes |

### Bookmarks and Collections
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/bookmarks` | Bookmark a story | Yes |
| GET | `/api/bookmarks` | List user bookmarks | Yes |
| DELETE | `/api/bookmarks/:id` | Remove a bookmark | Yes |
| GET | `/api/collections` | List user collections | Yes |
| POST | `/api/collections` | Create a collection | Yes |

### Search and Discovery
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| GET | `/api/search` | Search stories and users | No |
| GET | `/api/recommendations` | Get personalized recommendations | Yes |
| GET | `/api/story-inspiration` | Get writing inspiration prompts | No |

### Story Tools
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/story-consistency` | Check story consistency | Yes |
| POST | `/api/story-rating` | Rate a story | Yes |
| POST | `/api/plot-holes` | Detect plot holes | Yes |
| GET | `/api/characters` | List characters in a story | No |
| GET | `/api/story-visualizer` | Visualize story structure | Yes |

### Other Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:------------:|
| POST | `/api/newsletter` | Subscribe to newsletter | No |
| POST | `/api/contact` | Send a contact message | No |
| POST | `/api/bug-reports` | Submit a bug report | Yes |
| GET | `/api/notifications` | Get user notifications | Yes |
| POST | `/api/writer-applications` | Apply as a writer | Yes |

> **Note:** All authenticated endpoints require a valid `Authorization: Bearer <token>` header. Some endpoints may require specific subscription plans (e.g., AI features on paid plans).

---

## 🔧 Troubleshooting 🛠️

**Stories not generating?**
→ Set at least one of `OPEN_AI_KEY`, `GEMINI_API_KEY`, or `AI_API_KEYS`.

**Generate button fires multiple times / duplicate stories appear?**
→ This is issue [#4238](https://github.com/ronisarkarexe/story-spark-ai/issues/4238). Add a loading state that disables the button during the request. See [Known Behavior & UX Notes](#known-behavior--ux-notes-) for a code example.

**Stories lost after browser refresh?**
→ Story results are held in component state and are cleared on refresh. To persist them, save to `localStorage` or call the backend history endpoint after generation. Persistent storage support is tracked in [#4238](https://github.com/ronisarkarexe/story-spark-ai/issues/4238).

**Google Login not working?**
→ `GOOGLE_CLIENT_ID` is missing. Get it from [Google Cloud Console](https://console.cloud.google.com/).

**Story cover images not loading?**
→ `UNSPLASH_KEY_API` is not set. Register at [Unsplash Developers](https://unsplash.com/developers).

**Verification email not sent?**
→ For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your account password.

**MongoDB connection failed?**
→ Ensure MongoDB is running locally (`mongod`) or use an Atlas URI: `mongodb+srv://user:pass@cluster.mongodb.net/story_spark_ai`

**CORS error in browser?**
→ `CORS_ORIGINS` must exactly match your frontend URL including port. No trailing slash.

**`pnpm` command not found?**
→ Install globally: `npm install -g pnpm`, then verify with `pnpm --version`.

**Node.js version incompatibility?**
→ The project requires Node.js **18.18+**. Check with `node -v` and upgrade if needed.

**Port conflicts?**
→ Frontend uses **4001**, backend uses **5000**. Find and stop conflicting processes:
- Linux/macOS: `lsof -i :5000` then `kill -9 <PID>`
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

**`pnpm install` failures after switching branches?**
```bash
rm -rf node_modules   # Linux/macOS
pnpm install
```

**Admin seeding issues?**
→ Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are in `backend/.env`, then confirm MongoDB is running.

**Socket connection issues?**
→ Verify `VITE_SOCKET_URL` in `frontend/.env` points to the active socket service. Do not use your Vercel API URL for this.

> 💡 **Still stuck?** Open an issue or check existing ones — your problem may already have a solution!

---
## Architecture

```mermaid
flowchart TB
    Client["Client<br/>React + Vite SPA"]

    subgraph Backend["Backend API — Node.js + Express (/api/v1)"]
        Auth["Auth & Users<br/>JWT, profiles"]
        StoryEngine["Story Engine<br/>AI generation & continuation"]
        Payments["Payments<br/>Razorpay checkout"]
    end

    MongoDB[("MongoDB<br/>Data storage")]
    AIModel["AI Model<br/>Text generation"]
    Notify["Notifications<br/>Email + Socket.io"]
    Razorpay["Razorpay<br/>Payment gateway"]

    Client -- "REST /api/v1 + Socket.io" --> Backend
    Auth --> MongoDB
    StoryEngine --> MongoDB
    StoryEngine --> AIModel
    Payments --> MongoDB
    Payments --> Razorpay
    Backend --> Notify
```
## Contributing 👨‍💻

Contributions make the open source community such an amazing place to learn, inspire, and create.
**Any contributions you make are truly appreciated!**

**Contributing workflow:**
1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b your-feature-branch`
3. Install with `pnpm install` at the repo root and configure `.env` files.
4. `git add`, `git commit`, `git push`, then open a pull request.

---

## Contributors 🤝

Thanks to everyone who has helped build **StorySparkAI**. This grid updates automatically from [GitHub contributors](https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors).

<a href="https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ronisarkarexe/story-spark-ai&max=1000&columns=16" alt="Contributors" />
</a>

---

## Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ronisarkarexe">
        <img src="https://github.com/ronisarkarexe.png" width="120" height="120" alt="Roni Sarkar" style="border-radius: 6px; object-fit: cover;" />
      </a>
      <br /><br />
      <strong>Roni Sarkar</strong>
      <br />
      <sub>Project Maintainer · <a href="https://github.com/ronisarkarexe">@ronisarkarexe</a></sub>
    </td>
  </tr>
</table>

---

## License 📜

This project is licensed under [MIT](./LICENSE).

---

## Support 🙏

Thank you for contributing to our open-source project! We appreciate your support 🚀
Don't forget to leave a star ⭐
