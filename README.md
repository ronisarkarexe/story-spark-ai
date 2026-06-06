<div align="center">
<h1>👩‍💻 StorySparkAI is an open-source platform designed for creative minds to generate and share multiple story variations from a single prompt. Perfect for writers, creators, and enthusiasts exploring AI-powered storytelling!</h1>
</div>

<p align="center">
   <a href="https://github.com/ronisarkarexe/story-spark-ai/blob/master/LICENSE" target="blank">
   <img src="https://img.shields.io/github/license/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="License" />
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/fork" target="blank">
   <img src="https://img.shields.io/github/forks/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Forks"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/stargazers" target="blank">
   <img src="https://img.shields.io/github/stars/ronisarkarexe/story-spark-ai?style=for-the-badge&logo=appveyor" alt="Star"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/issues" target="blank">
   <img src="https://img.shields.io/github/issues/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Click Vote Issue"/>
   </a>
   <a href="https://github.com/ronisarkarexe/story-spark-ai/pulls" target="blank">
   <img src="https://img.shields.io/github/issues-pr/ronisarkarexe/story-spark-ai.svg?style=for-the-badge&logo=appveyor" alt="Click Vote Open Pull Request"/>
   </a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About 🚀](#about-)
- [Features 💪](#features-)
- [Local development (monorepo)](#local-development-monorepo)
- [Environment variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing 👨‍💻](#contributing-)
- [Contributors 🤝](#contributors-)
- [Maintainers](#maintainers)
- [License](#license)
- [Support 🙏](#support-)

<a id="about"></a>

## About 🚀

- story-spark-ai - [Website](https://storysparkai.vercel.app/)
- **`StorySparkAi`** is an open-source platform designed to empower creative minds by generating and showcasing AI-crafted stories from user prompts in a simple, engaging way.
- With **`StorySparkAi`**, users can input an idea, explore multiple story variations, save their favorites, and leverage AI analysis to enhance their creative writing journey.

<a id="features"></a>

## Features 💪

- **AI-Powered Story Generation**: Create unique stories instantly using advanced AI models.
- **Prompt-Based Storytelling**: Simply provide a prompt or idea and watch it come to life.
- **Story Bookmarks/History**: Save your favorite generated stories and revisit your past creations.
- **AI Analysis Capabilities**: Get AI insights, summaries, and critiques of your stories.
- **Creative Writing Assistance**: Overcome writer's block with intelligent suggestions and variations.
- **Responsive User Experience**: Enjoy a seamless and beautiful interface across all devices.

### Local development (monorepo)

**Prerequisites:** Node.js **18.18+**, npm **9+**, MongoDB URI for the API.

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-github-username>/story-spark-ai.git
   cd story-spark-ai
   ```

2. **Install dependencies** (single install at the repo root — npm workspaces)

   ```bash
   npm install
   ```

3. **Environment files**

   - Copy `backend/.env.example` → `backend/.env` and fill in all values (see [Environment variables](#environment-variables)).
  - Copy `frontend/.env.example` → `frontend/.env` and set `VITE_BASE_URL` to your API base URL (e.g. `http://localhost:5000/api/v1` when the backend runs on port 5000). Optionally set `VITE_SOCKET_URL` for real-time notifications; the frontend uses your logged-in access token to join the notification room.

   > Never commit `backend/.env` or `frontend/.env`. Only `.env.example` files belong in git.

4. **First-Time Setup (Admin Seeding)**

   Before starting the server for the first time, you must create an admin user:
   
   ```bash
   cd backend
   npx ts-node scripts/seed-admin.ts
   ```
   
   Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in your `backend/.env` file.

5. **Run apps**

   - **Both** (two terminals or one combined process):

     ```bash
     npm run dev
     ```

   - **Backend only:** `npm run dev:backend` — API (default port **5000** if `PORT` is unset).
   - **Frontend only:** `npm run dev:frontend` — Vite dev server on **http://localhost:4001**

6. **Production builds**

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
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Backend (`backend/.env`)

Variables marked **Yes** are required for local development. Variables marked **No** are optional and can usually use the default value. Variables marked for a feature are only required when you use that feature.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MongoDB connection string. Use a local URI such as `mongodb://localhost:27017/storysparkai` or an Atlas URI. |
| `PORT` | No | API port number. Defaults to `5000` if unset. |
| `NODE_ENV` | No | Runtime mode, usually `development` locally or `production` in deploys. |
| `CORS_ORIGINS` | No | Comma-separated frontend URLs allowed for CORS requests, e.g. `http://localhost:4001`. |
| `SALT_ROUNDS` | Yes | Bcrypt cost factor as a number, e.g. `10`. |
| `JWT_SECRET` | Yes | Access token signing secret, e.g. `your-jwt-secret`. Use a strong random value outside local testing. |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret, e.g. `your-refresh-secret`. Use a different strong value from `JWT_SECRET`. |
| `JWT_EXPIRES_IN` | Yes | Access token lifetime, e.g. `60d`, `24h`, or another valid duration string. |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime, e.g. `120d`, `30d`, or another valid duration string. |
| `DEFAULT_ADMIN_PASSWORD` | Yes | Initial admin password used during seeding, e.g. `admin123` for local development only. |
| `OPEN_AI_KEY` | For OpenAI | [OpenAI API key](https://platform.openai.com/api-keys), required only when using OpenAI-backed features. |
| `GEMINI_API_KEY` | For Gemini | [Google AI Studio key](https://aistudio.google.com/apikey), required only when using Gemini-backed features. |
| `UNSPLASH_KEY_API` | For images | [Unsplash Access Key](https://unsplash.com/developers), required only for Unsplash image features. |
| `UNSPLASH_KEY_API_SECRET` | For images | Unsplash secret, required only for Unsplash image features that need it. |
| `VERIFY_EMAIL` | For email | SMTP sender address, required only for email verification or email notifications. |
| `VERIFY_PASSWORD` | For email | SMTP password or app password, required only for email verification or email notifications. |
| `GOOGLE_CLIENT_ID` | For login with google | Google OAuth client ID from https://console.cloud.google.com, required only for Google login. |

Example backend `.env`:

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

#### MongoDB connection errors

- **Problem:** The backend starts with database connection errors or cannot load API data.
- **Possible cause:** `DATABASE_URL` is missing, incorrect, points to the wrong database, or MongoDB is not running.
- **Suggested solution:** Check `backend/.env` and verify `DATABASE_URL` matches your local MongoDB or Atlas URI. If you use local MongoDB, make sure the MongoDB service is running before starting the backend.

#### Missing environment variables

- **Problem:** The backend or frontend fails to start, or features break during development.
- **Possible cause:** Required values are missing from `backend/.env` or `frontend/.env`.
- **Suggested solution:** Compare your local `.env` files with `backend/.env.example` and `frontend/.env.example`, then add any missing variables.

#### Port conflicts

- **Problem:** The frontend or backend cannot start because a port is already in use.
- **Possible cause:** Another process is already using port **4001** for the frontend or **5000** for the backend.
- **Suggested solution:** Find and stop the conflicting process, then restart the app. On Windows, run `netstat -ano | findstr :5000` or `netstat -ano | findstr :4001`, then stop the process with `taskkill /PID <PID> /F`. If needed, change the backend `PORT` in `backend/.env` or update the frontend dev server port in the frontend configuration.

#### Dependency installation issues

- **Problem:** `npm install` fails or installed packages behave unexpectedly.
- **Possible cause:** Cached dependencies, a stale lock file, or an incomplete install.
- **Suggested solution:** Delete `node_modules` and the lock file, then reinstall dependencies from the repository root with `npm install`.

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
3. Install with `npm install` at the repo root, configure `.env` files, then `git add`, `git commit`, `git push`, and open a pull request.



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
npm install
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
npm install
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
