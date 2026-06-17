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
- [About 🚀](#about-🚀)
- [Features 💪](#features-💪)
- [Local Development](#local-development-monorepo)
- [Environment Variables](#environment-variables)
- [Troubleshooting 🛠️](#troubleshooting-🛠️)
- [Contributing 👨‍💻](#contributing-👨‍💻)
- [Contributors 🤝](#contributors-🤝)
- [Maintainers](#maintainers)
- [License 📜](#license-📜)
- [Support 🙏](#support-🙏)

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
- **Creative Writing Assistance**: Overcome writer’s block with intelligent suggestions.  
- **Responsive UI**: Seamless experience across devices.  

- **Dark-Mode**: Toggle between light and dark themes for a comfortable reading experience.
- **Google Login**: Sign in quickly and securely using your Google account.
- **User Reviews**: Share your experience and explore reviews from the community.
- **Subscription Plans**: Access unlimited story generation and team collaboration with paid plans.
- **Featured Posts**: Discover featured posts curated from the community.
- **AI-Powered Story Generation**: Create unique stories instantly using advanced AI models.
- **Prompt-Based Storytelling**: Simply provide a prompt or idea and watch it come to life.
- **Story Bookmarks/History**: Save your favorite generated stories and revisit your past creations.
- **AI Analysis Capabilities**: Get AI insights, summaries, and critiques of your stories.
- **Creative Writing Assistance**: Overcome writer's block with intelligent suggestions and variations.
- **Responsive User Experience**: Enjoy a seamless and beautiful interface across all devices.

## Local Development (Monorepo)

**Prerequisites:** Node.js **18.18+**, npm **9+**, MongoDB URI for the API.

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-github-username>/story-spark-ai.git
   ```
2. **Navigate to the project directory**

   ```bash
   cd story-spark-ai



3. **Install dependencies** (single install at the repo root — npm workspaces)

   ```bash
   pnpm install
   ```

4. **Environment files**

   - Copy `backend/.env.example` → `backend/.env` and fill in all values (see [Environment variables](#environment-variables)).
  - Copy `frontend/.env.example` → `frontend/.env` and set `VITE_BASE_URL` to your API base URL (e.g. `http://localhost:5000/api/v1` when the backend runs on port 5000). Optionally set `VITE_SOCKET_URL` for real-time notifications; the frontend uses your logged-in access token to join the notification room.

   > Never commit `backend/.env` or `frontend/.env`. Only `.env.example` files belong in git.

5. **First-Time Setup (Admin Seeding)**

   Before starting the server for the first time, you must create an admin user:
   
   ```bash
   cd backend
   npx ts-node scripts/seed-admin.ts
   ```
   
   Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in your `backend/.env` file.

6. **Run apps**

   - **Both** (two terminals or one combined process):

     ```bash
     pnpm dev
     ```

   - **Backend only:** `pnpm dev:backend` — API (default port **5000** if `PORT` is unset).
   - **Frontend only:** `pnpm dev:frontend` — Vite dev server on **http://localhost:4001**

7. **Production builds**

   ```bash
   npm run build
   npm run start:backend    # requires `npm run build:backend` first
   npm run start:frontend   # serves built static app (preview)
   ```

### Deploying on Vercel

Use **two** Vercel projects from this monorepo:

| Project | Root directory | Example domain |
|---------|----------------|----------------|
| Frontend | `frontend` | `storysparkai.vercel.app` |
| Backend API | `backend` | `apistorysparkai.vercel.app` |

**Frontend environment variables** (redeploy after changing):

- `VITE_BASE_URL` = `https://<your-api>.vercel.app/api/v1`
- `VITE_SOCKET_URL` = `https://notification-socket-io.onrender.com` (or your own persistent Node host)
- Do **not** point `VITE_SOCKET_URL` at your Vercel API URL — Vercel serverless cannot run Socket.IO, which causes endless `/socket.io/` **404** logs.

**Backend environment variables:** set `DATABASE_URL`, JWT secrets, AI keys, and `CORS_ORIGINS` including `https://storysparkai.vercel.app`.

**Git:** Use a **single** repository root (one `.git` folder). Do not nest another `.git` inside `frontend/` or `backend/`.

<a id="environment-variables"></a>

### Environment variables

After cloning, create your env files from the examples in the repo:

```bash
# 1. Clone the repository
git clone https://github.com/ronisarkarexe/story-spark-ai.git
cd story-spark-ai

# 2. Install all dependencies (npm workspaces — single install)
npm install
```
### Environment Variables

Copy the example env files and fill in your values:

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

#### Backend (`backend/.env`)
Variables marked Yes are required... Variables marked for a feature are only required when you use that feature.

#### 🖥️ Server Configuration (Backend)
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `development` | ✅ Yes | Environment mode |
| `PORT` | `5000` | ✅ Yes | Backend server port |
| `CORS_ORIGINS` | `http://localhost:4001` | ✅ Yes | Allowed frontend origin |

#### 🗄️ Database
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | `mongodb://127.0.0.1:27017/story_spark_ai` | ✅ Yes | MongoDB connection string ([Atlas](https://www.mongodb.com/cloud/atlas) or local) |

#### 🔐 Authentication
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `SALT_ROUNDS` | `10` | ✅ Yes | bcrypt hashing rounds |
| `JWT_SECRET` | `any_random_string` | ✅ Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | `another_random_string` | ✅ Yes | Refresh token signing secret |
| `JWT_EXPIRES_IN` | `60d` | ✅ Yes | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | `120d` | ✅ Yes | Refresh token expiry |
| `DEFAULT_ADMIN_PASSWORD` | `admin123` | ✅ Yes | Initial admin password for seeding |
| `ADMIN_EMAIL` | `admin@example.com` | ✅ Yes | Admin account email |
| `ADMIN_PASSWORD` | `secure-password` | ✅ Yes | Admin account password |

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
| `VERIFY_EMAIL` | `noreply@example.com` | ⚠️ Optional | Sender email for verification mails |
| `VERIFY_PASSWORD` | `app_password` | ⚠️ Optional | Email app password (not your login password) |

#### 🔑 Google OAuth
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ⚠️ Optional | Required for Google Login |

#### Frontend — `frontend/.env`
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VITE_BASE_URL` | `http://localhost:5000/api/v1` | ✅ Yes | Backend API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | ✅ Yes | WebSocket server URL |
| `VITE_GOOGLE_CLIENT_ID` | `xxxx.apps.googleusercontent.com` | ✅ Yes | Google OAuth Client ID |

#### ⚡ Minimum Setup for Local Development

Only these variables are needed to run core features:

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

#### 🔧 Troubleshooting

**Stories not generating?**
→ Set at least one of `OPEN_AI_KEY`, `GEMINI_API_KEY`, or `AI_API_KEYS`.

**Google Login not working?**
→ `GOOGLE_CLIENT_ID` is missing. Get it from [Google Cloud Console](https://console.cloud.google.com/).

**Story cover images not loading?**
→ `UNSPLASH_KEY_API` is not set. Register at [Unsplash Developers](https://unsplash.com/developers).

**Verification email not sent?**
→ For Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your account password.

**MongoDB connection failed?**
→ Ensure MongoDB is running locally: `mongod`
→ Or use Atlas URI: `mongodb+srv://user:pass@cluster.mongodb.net/story_spark_ai`

**CORS error in browser?**
→ `CORS_ORIGINS` must exactly match your frontend URL including port. No trailing slash.

### Running Locally

**Step 1 — Seed the admin user** *(first time only)*

Before starting the server for the first time, create an admin account:

```bash
cd backend
npx ts-node scripts/seed-admin.ts
```

Make sure `DEFAULT_ADMIN_PASSWORD` and `ADMIN_EMAIL` are set in `backend/.env`.

**Step 2 — Start development servers**

```bash
# Run both frontend & backend concurrently (from repo root)
npm run dev

# Or run individually:
npm run dev:backend    # API on http://localhost:5000
npm run dev:frontend   # Vite on http://localhost:4001
```

**Step 3 — Production build**

```bash
npm run build
npm run start:backend    # requires build:backend first
npm run start:frontend   # serves built static app (preview)
```

---

## ☁️ Deployment (Vercel)

This monorepo deploys as **two separate Vercel projects**:

| Project | Root Directory | Example Domain |
|---|---|---|
| 🖥️ Frontend | `frontend` | `storysparkai.vercel.app` |
| ⚙️ Backend API | `backend` | `apistorysparkai.vercel.app` |

**Frontend environment variables** *(set in Vercel dashboard → redeploy after changes)*:

```env
DATABASE_URL=mongodb://localhost:27017/storysparkai
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:4001
SALT_ROUNDS=10
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=60d
JWT_REFRESH_EXPIRES_IN=120d
DEFAULT_ADMIN_PASSWORD=admin123
```

#### Frontend (`frontend/.env`)

Variables prefixed with `VITE_` are exposed to the frontend by Vite. `VITE_SOCKET_URL` is optional if you are not testing real-time notifications locally.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | Yes | Backend API base URL, e.g. `http://localhost:5000/api/v1` for local development. |
| `VITE_SOCKET_URL` | No | Socket.IO server URL, e.g. `http://localhost:5000`. Optional unless you are using real-time notifications. |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID from https://console.cloud.google.com. |

Example frontend `.env`:

```env
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Troubleshooting

#### `pnpm` command not found

- **Problem:** Running `pnpm` commands returns a "command not found" error.
- **Possible cause:** `pnpm` is not installed globally on your system.
- **Suggested solution:** Install `pnpm` globally using npm:
  ```bash
  npm install -g pnpm
  ```
  Verify the installation by checking the version:
  ```bash
  pnpm --version
  ```

#### Node.js version incompatibility

- **Problem:** The backend or frontend fails to start, or throws unexpected runtime errors.
- **Possible cause:** Your installed Node.js version is older than the required version. The project requires Node.js **18.18** or later.
- **Suggested solution:** Check your installed Node.js version:
  ```bash
  node -v
  ```
  If your version is older than 18.18, please upgrade Node.js to the required version or later (available on the [official Node.js website](https://nodejs.org/)).

#### MongoDB connection errors

- **Problem:** The backend starts with database connection errors or cannot load API data.
- **Possible cause:** `DATABASE_URL` is missing, incorrect, points to the wrong database, or MongoDB is not running.
- **Suggested solution:** Check `backend/.env` and verify `DATABASE_URL` matches your local MongoDB or Atlas URI. If you use local MongoDB, make sure the MongoDB service is running before starting the backend.

#### MongoDB Atlas connection issues

- **Problem:** The backend cannot connect to a remote MongoDB Atlas database.
- **Possible cause:** The `DATABASE_URL` in `backend/.env` contains incorrect credentials, or your current IP address is not whitelisted on MongoDB Atlas.
- **Suggested solution:** Verify that your `DATABASE_URL` contains the correct database username and password. Ensure that your current IP address is whitelisted in the **Network Access** settings of your MongoDB Atlas dashboard.

#### Missing environment variables

- **Problem:** The backend or frontend fails to start, or features break during development.
- **Possible cause:** Required values are missing from `backend/.env` or `frontend/.env`.
- **Suggested solution:** Compare your local `.env` files with `backend/.env.example` and `frontend/.env.example`, then add any missing variables.

#### Environment variable changes not taking effect

- **Problem:** Changes made to `.env` files do not seem to apply to the running application.
- **Possible cause:** The development server only loads environment variables when it starts. Subsequent changes do not auto-reload.
- **Suggested solution:** Stop your running frontend or backend development server (usually by pressing `Ctrl + C` in the terminal) and restart it (e.g., `npm run dev`) to apply the new configuration.

#### Google OAuth configuration issues

- **Problem:** Users are unable to log in with Google, or Google OAuth returns authentication errors.
- **Possible cause:** Missing or mismatched Google Client IDs in your environment configuration, or credentials that do not match the Google Cloud Console setup.
- **Suggested solution:** Verify that `GOOGLE_CLIENT_ID` is set correctly in `backend/.env` and `VITE_GOOGLE_CLIENT_ID` is set correctly in `frontend/.env`. Ensure both values match the client credentials configured for your web application in the [Google Cloud Console](https://console.cloud.google.com).

#### Port conflicts

- **Problem:** The frontend or backend cannot start because a port is already in use.
- **Possible cause:** Another process is already using port **4001** for the frontend or **5000** for the backend.
- **Suggested solution:** Find and stop the conflicting process, then restart the app.
  - **Windows:** Run `netstat -ano | findstr :5000` or `netstat -ano | findstr :4001`, then stop the process with `taskkill /PID <PID> /F`.
  - **Linux/macOS:** Run `lsof -i :5000` or `lsof -i :4001` to find the process ID (PID), then stop it with `kill -9 <PID>`.
  If needed, change the backend `PORT` in `backend/.env` or update the frontend dev server port in the frontend configuration.

#### Dependency installation issues

- **Problem:** `pnpm install` fails or installed packages behave unexpectedly.
- **Possible cause:** Cached dependencies, a stale lock file, or an incomplete install.
- **Suggested solution:** Delete `node_modules` and the lock file, then reinstall dependencies from the repository root with `pnpm install`.

#### `pnpm install` failures after switching branches

- **Problem:** Running `pnpm install` fails or packages behave unexpectedly after switching git branches.
- **Possible cause:** Stale dependencies or mismatched lockfiles from the previous branch are causing conflicts.
- **Suggested solution:** Remove the `node_modules` directory and reinstall dependencies from the repository root:
  ```bash
  # Remove node_modules
  # On Windows (PowerShell):
  Remove-Item -Recurse -Force node_modules
  # On Linux/macOS:
  rm -rf node_modules

  # Reinstall dependencies
  pnpm install
  ```

#### Browser cache or hot reload problems

- **Problem:** UI updates are not visible in the browser, or hot module replacement (HMR) seems to have frozen.
- **Possible cause:** The browser has cached stale assets, or the Vite dev server's file watcher stopped responding.
- **Suggested solution:** Perform a hard refresh in your browser (`Ctrl + Shift + R` on Windows/Linux or `Cmd + Shift + R` on macOS). If the issue persists, stop and restart the frontend development server.

#### Admin seeding issues

- **Problem:** Admin user creation fails when running `npx ts-node scripts/seed-admin.ts`.
- **Possible cause:** Admin credentials are missing or the backend cannot connect to MongoDB.
- **Suggested solution:** Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `backend/.env`, then confirm `DATABASE_URL` is valid and MongoDB is running.

#### Socket connection issues

- **Problem:** Real-time notifications do not connect or the browser shows Socket.IO errors.
- **Possible cause:** `VITE_SOCKET_URL` is incorrect, missing, or the backend/socket service is not running.
- **Suggested solution:** Check `frontend/.env` and verify `VITE_SOCKET_URL` points to the active socket service. Make sure the backend/socket service is running, then check the browser console for connection errors.

### Contributing workflow

1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b your-feature-branch`
3. Install with `pnpm install` at the repo root, configure `.env` files, then `git add`, `git commit`, `git push`, and open a pull request.



<a id="contributing"></a>
## Troubleshooting 🛠️

Running into issues during setup? Here are the most common errors and how to fix them.

---

### 1. `npm error Override for @types/express conflicts with direct dependency`

**Cause:** There's a version mismatch in the root `package.json` — `@types/express` is set to `^5.0.6` in `devDependencies`, which conflicts with what the project expects.

**Fix:** Open your root `package.json` and change the `@types/express` version under `devDependencies`:

```json
// ❌ Before
"@types/express": "^5.0.6"

// ✅ After
"@types/express": "^4.17.21"
```

Then re-run:
```bash
pnpm install
```

---

### 2. `docker: The term 'docker' is not recognized`

**Cause:** Docker Desktop is not installed or not added to your system PATH.

**Fix:** Download and install Docker Desktop from the official site:
👉 https://www.docker.com/products/docker-desktop/

After installation, restart your terminal and verify with:
```bash
docker --version
```

---

### 3. `WSL needs updating` error in Docker Desktop

**Cause:** Your Windows Subsystem for Linux (WSL) version is outdated and incompatible with the current Docker Desktop.

**Fix:** Run the following command in your terminal (as Administrator if needed):
```bash
wsl --update
```
Once the update completes, click **Try Again** in Docker Desktop. If the issue persists, restart your machine.

---

### 4. `npm ci` fails inside Docker with missing or out-of-sync `package-lock.json`

**Cause:** The `package-lock.json` is either missing or out of sync with `package.json`, causing `npm ci` to fail.

**Fix:** At the **repo root**, regenerate the lockfile:
```bash
pnpm install
```
Then commit the updated `package-lock.json` before rebuilding your Docker image:
```bash
git add package-lock.json
git commit -m "chore: regenerate package-lock.json"
```

---

> > 💡 **Still stuck?** Open an issue or check existing ones — your problem may already have a solution!

## Contributing 👨‍💻

Contributions make the open source community such an amazing place to learn, inspire, and create. <br>
**Any contributions you make are truly appreciated!**

<a id="contributors"></a>

## Contributors 🤝

Thanks to everyone who has helped build **Story Spark AI**. This grid updates automatically from [GitHub contributors](https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors).

<a href="https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ronisarkarexe/story-spark-ai&max=500&columns=12" alt="Contributors" />
</a>

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
      <br /><br />
      <a href="https://github.com/ronisarkarexe" title="GitHub">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="28" height="28" alt="GitHub" />
      </a>
      &nbsp;
      <a href="https://www.linkedin.com/in/ronisarkarexe" title="LinkedIn">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="28" height="28" alt="LinkedIn" />
      </a>
      &nbsp;
      <a href="https://x.com/ronisarkar_exe" title="X (Twitter)">
        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" width="28" height="28" alt="X" />
      </a>
    </td>
  </tr>
</table>

<a id="license"></a>

## License

<table>
  <tr>
     <td>
       <p align="center"> <img src="https://github.com/malivinayak/malivinayak/blob/main/LICENSE-Logo/MIT.png?raw=true" width="80%"></img>
    </td>
    <td> 
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/> <br> 
         This project is licensed under <a href="./LICENSE">MIT</a>. <img width=2300/>
    </td>
  </tr>
</table>

<a id="support"></a>

## Support 🙏

Thank you for contributing to our open-source project! We appreciate your support 🚀 <br>
Don't forget to leave a star ⭐

### Proposed Feature: Trending Topics & UI Enhancements
- Added responsive writing genres (Fantasy, Mystery, Romance) next to recommended writers.
- Implemented a clean 'How It Works' section to polish the landing page layout.

### Proposed Feature: Trending Topics & UI Enhancements
- Added responsive writing genres (Fantasy, Mystery, Romance) next to recommended writers.
- Implemented a clean 'How It Works' section to polish the landing page layout.

