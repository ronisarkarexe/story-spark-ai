# AlgoBuddy

**Visualize & Learn Data Structures and Algorithms the Smart Way.**

AlgoBuddy is an open-source, interactive DSA learning platform that brings algorithms to life through step-by-step animations, structured learning paths, and progress tracking — built for students, developers, and interview candidates.


---
**Join our community**
**Discord Server : https://discord.gg/Gv2N4U3KAc**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

**Algorithm Visualizer**
- Sorting: Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort
- Searching: Linear Search, Binary Search
- Stack: Push/Pop, Peek, isEmpty, isFull, Polish Notation (Prefix/Postfix), Array and Linked List implementations
- Queue: Enqueue/Dequeue, Peek Front, isEmpty, isFull, Single-ended, Double-ended, Circular, Priority Queue, Array and Linked List implementations
- Linked List: Singly, Doubly, Circular — with Insertion, Deletion, Traversal, Merge, Reverse, and Comparison
- Trees: Binary Tree types, In-order Traversal
-- HashMap: Insert, Search, Delete operations with collision handling visualization

**User System**
- Email/password auth with Cloudflare Turnstile captcha verification
- Google OAuth sign-in
- User dashboard with module progress tracking
- Activity heatmap (last 90 days) and streak counter

**Blog**
- Category filtering and full-text search
- Articles on DSA concepts with reading time estimates

**UX**
- Dark / Light mode toggle persisted to localStorage
- Responsive design across mobile, tablet, and desktop
- Animated visualizations via GSAP and Framer Motion
- Complexity graphs rendered with Recharts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database / Auth | Supabase |
| Animation | GSAP, Framer Motion |
| Charts | Recharts |
| Email | Nodemailer (Gmail) |
| Captcha | Cloudflare Turnstile |
| Analytics | Google Analytics 4 |
| Deployment | Vercel |
| CI | GitHub Actions (Node 20, Ubuntu / macOS / Windows) |

---

## Project Structure

```
AlgoBuddy/
├── app/
│   ├── api/               # API routes (auth, contact, send-review)
│   ├── blogs/             # Blog pages and content
│   ├── components/        # Shared UI components
│   │   ├── dashboard/     # Activity heatmap, streak counter
│   │   ├── models/        # Data structure visual models
│   │   └── ui/            # Reusable primitives
│   ├── contexts/          # React contexts (UserContext, AuthContext)
│   ├── dashboard/         # User dashboard page
│   ├── login/             # Authentication page
│   └── visualizer/        # Algorithm visualizer pages
├── lib/                   # Supabase client, activity tracker, gtag
├── public/                # Static assets
├── utils/                 # Auth helpers
├── .github/workflows/     # CI pipeline
└── tailwind.config.js
```

---

## Getting Started

**Prerequisites:** Node.js 20+, npm

```bash
# 1. Clone the repository
git clone https://github.com/PankajSingh34/AlgoBuddy.git
cd AlgoBuddy

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp EnvExample.txt .env.local
# Fill in the values — especially NEXT_PUBLIC_SUPABASE_URL and
# NEXT_PUBLIC_SUPABASE_ANON_KEY. The app will start without them, but auth,
# dashboard, and middleware session refresh will be disabled until they are set.

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---


## Environment Variables

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


Create a `.env.local` file at the root with the following keys (see `EnvExample.txt`):

| Variable | Description |
|---|---|
| `EMAIL_USER` | Gmail address used to send contact/review emails |
| `EMAIL_PASSWORD` | Gmail App Password (not your account password) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

Minimum required for Supabase auth and dashboard features:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`


If those values are missing or invalid, the app now falls back to a safe no-op
Supabase client for startup, and middleware skips session refresh instead of
crashing the dev server.

#### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MongoDB connection string (local or [Atlas](https://www.mongodb.com/cloud/atlas)) |
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `CORS_ORIGINS` | No | Comma-separated frontend URLs (e.g. `http://localhost:4001`) |
| `SALT_ROUNDS` | Yes | Bcrypt cost factor (e.g. `10`) |
| `JWT_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `JWT_EXPIRES_IN` | Yes | Access token lifetime (e.g. `60d`) |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token lifetime (e.g. `120d`) |
| `DEFAULT_ADMIN_PASSWORD` | Yes | Initial admin password on seed |
| `OPEN_AI_KEY` | For OpenAI | [OpenAI API key](https://platform.openai.com/api-keys) |
| `GEMINI_API_KEY` | For Gemini | [Google AI Studio key](https://aistudio.google.com/apikey) |
| `UNSPLASH_KEY_API` | For images | [Unsplash Access Key](https://unsplash.com/developers) |
| `UNSPLASH_KEY_API_SECRET` | For images | Unsplash secret |
| `VERIFY_EMAIL` | For email | SMTP sender address |
| `VERIFY_PASSWORD` | For email | SMTP password or app password |
| `GOOGLE_CLIENT_ID` | For login with google | https://console.cloud.google.com |
| `CORS_ORIGINS` | For resolve cors |

#### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | Yes | API base URL, e.g. `http://localhost:5000/api/v1` |
| `VITE_SOCKET_URL` | No | Socket.IO URL for real-time notifications (optional) |
| `VITE_GOOGLE_CLIENT_ID` | Yes | https://console.cloud.google.com |

### Contributing workflow

1. Fork the repository and clone your fork.
2. Create a branch: `git checkout -b your-feature-branch`
3. Install with `npm install` at the repo root, configure `.env` files, then `git add`, `git commit`, `git push`, and open a pull request.



<a id="contributing"></a>

## Contributing 👨‍💻

Contributions make the open source community such an amazing place to learn, inspire, and create. <br>
**Any contributions you make are truly appreciated!**

<a id="contributors"></a>

## Contributors 🤝

<!-- CONTRIBUTORS:START -->
Thanks to everyone who has helped build **Story Spark AI**. This section updates automatically when `contributors.json` changes. Merges entries from `contributors.json` with [GitHub contributors](https://github.com/ronisarkarexe/story-spark-ai/graphs/contributors).

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ronisarkarexe">
        <img src="https://github.com/ronisarkarexe.png" width="100" alt="ronisarkarexe" />
        <br />
        <sub><b>Roni Sarkar</b></sub>
      </a>
      <br />
      <sub>Maintainer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/mzl2233">
        <img src="https://github.com/mzl2233.png" width="100" alt="mzl2233" />
        <br />
        <sub><b>mzl2233</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/amrendrasharma1328-a11y">
        <img src="https://github.com/amrendrasharma1328-a11y.png" width="100" alt="amrendrasharma1328-a11y" />
        <br />
        <sub><b>amrendrasharma1328-a11y</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Swetanegi05">
        <img src="https://github.com/Swetanegi05.png" width="100" alt="Swetanegi05" />
        <br />
        <sub><b>Swetanegi05</b></sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/rajdeep-yadav">
        <img src="https://github.com/rajdeep-yadav.png" width="100" alt="rajdeep-yadav" />
        <br />
        <sub><b>Rajdeep</b></sub>
      </a>
    </td>
    <td align="center">
      <sub><b>P. Harshini Padmavathi</b></sub>
    </td>
  </tr>
</table>

<!-- CONTRIBUTORS:END -->

<a id="license"></a>


Never commit `.env.local` to version control. It is listed in `.gitignore`.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please follow clean code practices and test your changes before submitting. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

---

## License

Licensed under the [Apache 2.0 License](./LICENSE).

---

Made with care by [Pankaj Singh](https://www.linkedin.com/in/pankaj-singh-2a968b212/) and contributors.
