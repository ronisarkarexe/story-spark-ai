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
</p>

---

## 📚 Table of Contents
- [About 🚀](#about-)
- [Features 💪](#features-)
- [Known Behavior & UX Notes](#known-behavior--ux-notes-)
- [Local Development](#local-development-monorepo)
- [Environment Variables](#environment-variables)
- [Minimal Working Example (Story Generation API)](#minimal-working-example-story-generation-api)
- [API Endpoint Reference](#api-endpoint-reference-)
- [Troubleshooting 🛠️](#troubleshooting-️)
- [Contributing 👨‍💻](#contributing-)
- [Contributors 🤝](#contributors-)
- [Maintainers](#maintainers)
- [License 📜](#license-)
- [Support 🙏](#support-)

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

## API Endpoint Reference 📖

> Resolves Issue [#4832](https://github.com/ronisarkarexe/story-spark-ai/issues/4832). This table gives contributors a single place to see available backend routes, their HTTP methods, and whether a valid `Authorization: Bearer <token>` header is required, so you don't have to dig through `backend/src` to find this out.
>
> ⚠️ **Draft reference:** This list was compiled from the features and endpoints already documented above in this README (auth, story generation, bookmarks, reviews, subscriptions, admin). It is a starting point, not a guarantee — please cross-check against the actual route files under `backend/src/**/*.routes.ts` before relying on it, and open a PR to correct/extend this table if you spot a mismatch.

All paths are relative to your API base URL, e.g. `http://localhost:5000/api/v1`.

### 🔐 Auth

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/auth/register` | POST | No | Create a new user account with email & password |
| `/auth/login` | POST | No | Log in with email & password, returns access + refresh tokens |
| `/auth/google` | POST | No | Log in / sign up via Google OAuth (`GOOGLE_CLIENT_ID`) |
| `/auth/refresh-token` | POST | No (requires valid refresh token in body/cookie) | Issue a new access token |
| `/auth/logout` | POST | Yes | Invalidate the current session/refresh token |
| `/auth/verify-email` | POST | No | Confirm email using the verification link/code sent via `VERIFY_EMAIL` |

### 👤 User

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/user/me` | GET | Yes | Get the current logged-in user's profile |
| `/user/me` | PATCH | Yes | Update profile fields (name, avatar, preferences) |
| `/user/me` | DELETE | Yes | Delete the current user's account |

### 📝 Story

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/story/generate` | POST | Yes | Generate AI story variations from a prompt (see [Minimal Working Example](#-minimal-working-example-story-generation-api)) |
| `/story/history` | GET | Yes | List the current user's previously generated stories |
| `/story/:id` | GET | Yes | Get a single story by ID |
| `/story/:id` | DELETE | Yes | Delete a story from history |
| `/story/:id/bookmark` | POST | Yes | Bookmark a story |
| `/story/:id/bookmark` | DELETE | Yes | Remove a bookmark |
| `/story/bookmarks` | GET | Yes | List all bookmarked stories for the current user |
| `/story/:id/analysis` | GET | Yes | Get AI-generated summary/critique for a story |

### 🌟 Featured Posts

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/featured-posts` | GET | No | List community-curated featured posts |
| `/featured-posts/:id` | GET | No | Get a single featured post by ID |

### 💬 Reviews

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/review` | GET | No | List public user reviews |
| `/review` | POST | Yes | Submit a new review |
| `/review/:id` | DELETE | Yes (owner or admin) | Delete a review |

### 💳 Subscription

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/subscription/plans` | GET | No | List available subscription plans and pricing |
| `/subscription/checkout` | POST | Yes | Start a checkout session for a chosen plan |
| `/subscription/status` | GET | Yes | Get the current user's subscription status |
| `/subscription/cancel` | POST | Yes | Cancel the current user's active subscription |

### 🛠️ Admin

| Endpoint | Method | Auth Required | Description |
|----------|--------|:--------------:|-------------|
| `/admin/users` | GET | Yes (Admin) | List all registered users |
| `/admin/users/:id` | DELETE | Yes (Admin) | Delete a user account |
| `/admin/reviews/:id` | DELETE | Yes (Admin) | Moderate/delete a review |
| `/admin/stats` | GET | Yes (Admin) | Get platform usage statistics |

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
