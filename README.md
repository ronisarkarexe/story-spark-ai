
<div align="center">

<img src="https://raw.githubusercontent.com/ronisarkarexe/story-spark-ai/refs/heads/main/frontend/public/favicon.ico" width="80" alt="StorySparkAI Logo" />

# StorySparkAI

**Generate multiple AI-powered story variations from a single prompt.**  
Open-source · Creative · Community-driven

[![License](https://img.shields.io/github/license/ronisarkarexe/story-spark-ai?style=for-the-badge)](https://github.com/ronisarkarexe/story-spark-ai/blob/master/LICENSE)
[![Forks](https://img.shields.io/github/forks/ronisarkarexe/story-spark-ai?style=for-the-badge)](https://github.com/ronisarkarexe/story-spark-ai/fork)
[![Stars](https://img.shields.io/github/stars/ronisarkarexe/story-spark-ai?style=for-the-badge)](https://github.com/ronisarkarexe/story-spark-ai/stargazers)
[![Issues](https://img.shields.io/github/issues/ronisarkarexe/story-spark-ai?style=for-the-badge)](https://github.com/ronisarkarexe/story-spark-ai/issues)
[![PRs](https://img.shields.io/github/issues-pr/ronisarkarexe/story-spark-ai?style=for-the-badge)](https://github.com/ronisarkarexe/story-spark-ai/pulls)

[🌐 Live Demo](https://storysparkai.vercel.app/) · [🐛 Report a Bug](https://github.com/ronisarkarexe/story-spark-ai/issues/new) · [✨ Request a Feature](https://github.com/ronisarkarexe/story-spark-ai/issues/new)

</div>

---

## 📚 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Quick Reference](#-api-quick-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [Maintainers](#maintainers)
- [License](#-license)

---

## 🚀 About

**StorySparkAI** is an open-source creative writing platform that takes a single prompt and returns multiple distinct story variations powered by AI. Writers, educators, and hobbyists use it to overcome writer's block, explore narrative directions, and experiment with AI-assisted storytelling.

- Input any idea or prompt
- Instantly get multiple unique story variations
- Save favourites and revisit your history
- Get AI analysis: summaries, critiques, and writing insights

---

## 💪 Features

| Feature | Description |
|---|---|
| 🤖 AI Story Generation | Create unique stories using OpenAI or Gemini |
| 📖 Multiple Variations | One prompt → several distinct story directions |
| 🔖 Bookmarks & History | Save and revisit your favourite creations |
| 🔍 AI Analysis | Summaries, critiques, and insights on your stories |
| 🌗 Dark / Light Mode | Comfortable reading in any environment |
| 🔐 Google Login | One-click sign-in via Google OAuth |
| 💳 Subscription Plans | Unlock unlimited generation with paid tiers |
| ⭐ Community Posts | Browse featured stories from other users |
| 🔔 Real-time Notifications | Live updates via Socket.IO |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, Google OAuth 2.0 |
| AI Providers | OpenAI, Google Gemini |
| Real-time | Socket.IO |
| Package Manager | pnpm (monorepo) |
| Deployment | Vercel (frontend + backend) |

---

## 📁 Project Structure

```
story-spark-ai/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # API calls
│   │   └── hooks/
│   └── .env.example
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/  # AI provider logic
│   ├── scripts/
│   │   └── seed-admin.ts
│   └── .env.example
├── docs/
│   └── ai-story-generation.md
└── package.json       # pnpm workspace root
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js **18.18+**
- pnpm **8+**
- MongoDB URI (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- At least one AI key: OpenAI **or** Gemini

### 1. Fork & Clone

```bash
# Fork first on GitHub, then:
git clone https://github.com/<your-username>/story-spark-ai.git
cd story-spark-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Files

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the values — see [Environment Variables](#-environment-variables) below.

> ⚠️ Never commit `backend/.env` or `frontend/.env`. Only `.env.example` files belong in git.

### 4. Seed the Admin User *(first time only)*

```bash
cd backend
npx ts-node scripts/seed-admin.ts
```

Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `backend/.env` first.

### 5. Run in Development

```bash
# Both frontend + backend (from repo root)
pnpm dev

# Or individually:
pnpm dev:backend    # API → http://localhost:5000
pnpm dev:frontend   # Vite → http://localhost:4001
```

### 6. Production Build

```bash
pnpm run build
pnpm run start:backend
pnpm run start:frontend
```

---

## ⚙️ Environment Variables

### Minimum Setup for Local Development

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

### Full Variable Reference

#### 🖥️ Server

| Variable | Example | Required | Description |
|---|---|---|---|
| `NODE_ENV` | `development` | ✅ | Environment mode |
| `PORT` | `5000` | ✅ | Backend port |
| `CORS_ORIGINS` | `http://localhost:4001` | ✅ | Allowed frontend origin (no trailing slash) |

#### 🗄️ Database

| Variable | Example | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | `mongodb://127.0.0.1:27017/story_spark_ai` | ✅ | MongoDB connection string |

#### 🔐 Authentication

| Variable | Example | Required | Description |
|---|---|---|---|
| `SALT_ROUNDS` | `10` | ✅ | bcrypt hashing rounds |
| `JWT_SECRET` | `any_random_string` | ✅ | Access token secret |
| `JWT_REFRESH_SECRET` | `another_random_string` | ✅ | Refresh token secret |
| `JWT_EXPIRES_IN` | `60d` | ✅ | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | `120d` | ✅ | Refresh token expiry |
| `ADMIN_EMAIL` | `admin@example.com` | ✅ | Admin account email |
| `ADMIN_PASSWORD` | `secure-password` | ✅ | Admin account password |
| `DEFAULT_ADMIN_PASSWORD` | `admin123` | ✅ | Seed script default |

#### 🤖 AI Providers

> You need **at least one** of these for story generation to work.

| Variable | Example | Required | Description |
|---|---|---|---|
| `OPEN_AI_KEY` | `sk-...` | ⚠️ Optional | OpenAI story generation |
| `GEMINI_API_KEY` | `AIza...` | ⚠️ Optional | Gemini story generation |
| `AI_API_KEYS` | `key1,key2,key3` | ⚠️ Optional | Round-robin key rotation |
| `AI_CONCURRENCY` | `3` | ⚠️ Optional | Max simultaneous AI calls |

#### 🖼️ Images, Email, OAuth

| Variable | Example | Required | Description |
|---|---|---|---|
| `UNSPLASH_KEY_API` | `your_access_key` | ⚠️ Optional | Story cover images |
| `UNSPLASH_KEY_API_SECRET` | `your_secret` | ⚠️ Optional | Unsplash secret |
| `VERIFY_EMAIL` | `noreply@example.com` | ⚠️ Optional | Verification email sender |
| `VERIFY_PASSWORD` | `app_password` | ⚠️ Optional | Email app password |
| `GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ⚠️ Optional | Google Login |

#### 🌐 Frontend (`frontend/.env`)

| Variable | Example | Required | Description |
|---|---|---|---|
| `VITE_BASE_URL` | `http://localhost:5000/api/v1` | ✅ | Backend API URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | ⚠️ Optional | WebSocket URL |
| `VITE_GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ✅ | Google OAuth Client ID |

---

## 🧪 API Quick Reference

Once the backend is running, verify your setup with this request:

```bash
curl -X POST http://localhost:5000/api/v1/story/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{ "prompt": "A lost astronaut discovers a planet made of memories" }'
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

> You must be logged in first to obtain a Bearer token. See [AI Story Generation Pipeline](docs/ai-story-generation.md) for the full API reference.

---

## ☁️ Deployment

Deploy using **two separate Vercel projects** from the same monorepo:

| Project | Root Directory | Example Domain |
|---|---|---|
| Frontend | `frontend/` | `storysparkai.vercel.app` |
| Backend API | `backend/` | `apistorysparkai.vercel.app` |

**Key notes:**
- Set `VITE_BASE_URL` → your backend Vercel URL
- Set `VITE_SOCKET_URL` → a persistent Node host (e.g. Render). **Do not** point this at Vercel — serverless functions cannot run Socket.IO
- Set `CORS_ORIGINS` in backend to include your frontend Vercel URL
- Use a **single** `.git` folder at the repo root — do not nest git repos inside `frontend/` or `backend/`

---

## 🔧 Troubleshooting

<details>
<summary><strong>Stories not generating</strong></summary>

Set at least one of `OPEN_AI_KEY`, `GEMINI_API_KEY`, or `AI_API_KEYS` in `backend/.env`.
</details>

<details>
<summary><strong>Google Login not working</strong></summary>

`GOOGLE_CLIENT_ID` is missing or mismatched. Verify it matches your [Google Cloud Console](https://console.cloud.google.com/) credentials in both `backend/.env` and `frontend/.env`.
</details>

<details>
<summary><strong>MongoDB connection failed</strong></summary>

Check `DATABASE_URL` in `backend/.env`. For local MongoDB, ensure the service is running (`mongod`). For Atlas, whitelist your IP in **Network Access** settings.
</details>

<details>
<summary><strong>CORS error in browser</strong></summary>

`CORS_ORIGINS` must exactly match your frontend URL including the port. No trailing slash.
</details>

<details>
<summary><strong>pnpm command not found</strong></summary>

```bash
npm install -g pnpm
pnpm --version  # verify
```
</details>

<details>
<summary><strong>Port already in use</strong></summary>

Find and stop the conflicting process:
- **Linux/macOS:** `lsof -i :5000` then `kill -9 <PID>`
- **Windows:** `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
</details>

<details>
<summary><strong>pnpm install fails after switching branches</strong></summary>

```bash
rm -rf node_modules   # Linux/macOS
# or: Remove-Item -Recurse -Force node_modules  (Windows PowerShell)
pnpm install
```
</details>

<details>
<summary><strong>Socket.IO / real-time notifications not working</strong></summary>

Check `VITE_SOCKET_URL` in `frontend/.env`. This must point to a persistent server (e.g. Render), not a Vercel URL.
</details>

<details>
<summary><strong>Admin seeding fails</strong></summary>

Verify `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `DATABASE_URL` are all set in `backend/.env` and MongoDB is reachable.
</details>

<details>
<summary><strong>@types/express version conflict</strong></summary>

In root `package.json`, change `"@types/express"` under `devDependencies` to `"^4.17.21"`, then re-run `pnpm install`.
</details>

<details>
<summary><strong>Docker not found / WSL needs updating</strong></summary>

Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/). For WSL errors on Windows, run `wsl --update` as Administrator.
</details>

> 💡 Still stuck? [Search existing issues](https://github.com/ronisarkarexe/story-spark-ai/issues) — your problem may already have a solution.

---

## 🤝 Contributing

Contributions are what make open source thrive. All contributions are appreciated!

### Workflow

1. **Fork** the repo and clone your fork
2. **Create a branch:** `git checkout -b feat/your-feature-name`
3. **Install deps:** `pnpm install` at repo root
4. **Set up `.env` files** (see [Environment Variables](#-environment-variables))
5. **Make your changes** and test locally
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add story export button`
   - `fix: resolve dark mode contrast issue`
   - `docs: update environment variable table`
7. **Push** and open a Pull Request — link the issue it closes (`Closes #123`)

### PR Checklist

- [ ] PR title follows Conventional Commits format
- [ ] Linked the issue this PR closes
- [ ] Tested locally (`pnpm dev` after setting up `.env` files)
- [ ] No console errors or lint warnings

---

## 👥 Contributors

Thanks to everyone who has helped build Story Spark AI!

<a href="https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ronisarkarexe/story-spark-ai&max=1000&columns=16" alt="Contributors" />
</a>

---

## Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ronisarkarexe">
        <img src="https://github.com/ronisarkarexe.png" width="100" height="100" alt="Roni Sarkar" style="border-radius:6px;" />
      </a>
      <br /><br />
      <strong>Roni Sarkar</strong><br />
      <sub>Project Maintainer · <a href="https://github.com/ronisarkarexe">@ronisarkarexe</a></sub>
      <br /><br />
      <a href="https://github.com/ronisarkarexe"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="24" /></a>
      &nbsp;
      <a href="https://www.linkedin.com/in/ronisarkarexe"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="24" /></a>
      &nbsp;
      <a href="https://x.com/ronisarkar_exe"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" width="24" /></a>
    </td>
  </tr>
</table>

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🙏 Support

If this project helped you, please consider leaving a ⭐ — it helps others discover the project!

<div align="center">
  <sub>Built with ❤️ by the StorySparkAI community</sub>
</div>
